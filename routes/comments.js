var express     = require('express');
var router      = express.Router({mergeParams: true});
var Campground  = require('../models/campground');
var Comment     = require('../models/comment');


// Comments New
router.get('/new', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// Comments Create
router.post('/', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          comment.author.id = req.user.__id;
          comment.author.username = req.user.username;
          comment.save();
          console.log('New comment username will be' + req.user.username);
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect('/campgrounds/' + campground.id);
        }
      })
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
