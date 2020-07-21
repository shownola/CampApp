var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

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
router.post('/', isLoggedIn, function(req, res){
  // get data from form and add to cgs array then redirect back to the cgs page
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author};

  // campgrounds.push(newCampground);
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campground
router.get('/new', isLoggedIn, function(req, res){
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
router.get('/:id/edit', checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render('campgrounds/edit', {campground: foundCampground});
  });

});

// UDPATE
router.put('/:id', checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// Destroy

router.delete('/:id', checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  })
});

// middleware

function checkCampgroundOwnership(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect('back');
      } else {
          if(foundCampground.author.id.equals(req.user._id)){
            next();
          } else {
            res.redirect('back');
          }
      }
    });
  } else {
    res.redirect('back');
  }

}


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}



module.exports = router;
