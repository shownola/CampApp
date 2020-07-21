var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User = require('../models/user');


// ROOT ROUTE
router.get('/', function(req, res){
  res.render('landing');
});


// SIGNUP FORM
router.get('/register', function(req, res){
  res.render('register');
});
// SIGNUP
router.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      req.flash('err', err.message);
      return res.render('register', {err: err.message});
    }
    passport.authenticate('local')(req, res, function(){
      req.flash('success', 'Successfully Sign up!')
      res.redirect('/campgrounds');
    });
  });
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});
// Login
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), function(req, res){

});

// Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/campgrounds');
});

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


module.exports = router;
