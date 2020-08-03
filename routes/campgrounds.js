require('dotenv').config();

var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'campapp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// INDEX - shows all campgrounds
router.get('/', function(req, res){
  console.log(req.user)
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds:allCampgrounds});
    }
  });
});




// CREATE CAMPGROUND:

// router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
//   cloudinary.uploader,upload(req.file.path, function(result){
//     req.body.campground.image = result.secure_url;
//     req.body.campground.author = {
//       id: req.user._id,
//       username: req.user.username
//     }
//     Campground.create(req.body.campground, function(err, campground){
//       if(err){
//         req.flash('error', err.message);
//         return res.redirect('back');
//       }
//       res.redirect('/campgrounds/' + campground.id);
//     });
//   });

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
  cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
    req.body.campground.image = result.secure_url;
    // add image's public_id to campground object
    req.body.campground.imageId = result.public_id;

    // add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }

  Campground.create(req.body.campground, function(err, campground) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/campgrounds/' + campground.id);
  });
  });
});


// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('campgrounds/new')
});

// SHOW
router.get('/:id', function(req, res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render('campgrounds/edit', {campground: foundCampground});
  });

});



// UDPATE
router.put('/:id', middleware.checkCampgroundOwnership, upload.single('image'), function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, async function(err, campground){
    if(err){
      req.flash('error', err.message);
      // res.redirect('/campgrounds');
      res.redirect('back');
    } else {
      if(req.file){
        try {
          await cloudinary.v2.uploader.destroy(campground.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          console.log(result);

          campground.image = result.secure_url;
          campground.imageId = result.public_id;

          console.log(result.secure_url);
          console.log(result.public_id);
        } catch(err){
          req.flash('error', err.message);
          return res.redirect('back');
        }

      }
      // campground.name = req.body.name ? req.body.name : campground.name;
      campground.name = req.body.campground.name;
      campground.description = req.body.campground.description;
      campground.save();
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});


// Destroy

// router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
//   Campground.findByIdAndRemove(req.params.id, function(err){
//     if(err){
//       res.redirect('/campgrounds');
//     } else {
//       res.redirect('/campgrounds');
//     }
//   })
// });

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, async function(err, campground){
    if(err){
      req.flash('error', err.message);
      return res.redirect('back');
    }
    try {
      await cloudinary.v2.uploader.destroy(campground.imageId);
      campground.remove();
      res.redirect('/campgrounds');
    } catch(err){
      if(err){
        req.flash('error', err.message);
        return res.redirect('back');
      }
    }
  })
});

module.exports = router;
