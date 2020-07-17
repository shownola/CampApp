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

// NEW - show form to create new campground
router.get('/new', isLoggedIn, function(req, res){
  res.render('campgrounds/new')
})

// CREATE CAMPGROUND:
router.post('/', isLoggedIn, function(req, res){
  // get data from form and add to cgs array then redirect back to the cgs page
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user.__id,
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

// SHOW
router.get('/:id', function(req, res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground});
    }
  })
});

// EDIT
router.get('/:id/edit', function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/edit', {campground: foundCampground});
    }
  });
});
// UDPATE
router.put('/:id', function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

// Destroy
router.delete('/:id', function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  })
});

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
