var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user');
    seedDB        = require('./seeds');

mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
// mongoose.connect('mongodb://localhost/camp_app');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Once again Rusty wins',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function(req, res){
  res.render('landing');
});

// INDEX - shows all campgrounds
app.get('/campgrounds', function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds:allCampgrounds});
    }
  });
});

// NEW - show form to create new campground
app.get('/campgrounds/new', isLoggedIn, function(req, res){
  res.render('campgrounds/new')
})

// CREATE CAMPGROUND:
app.post('/campgrounds', isLoggedIn, function(req, res){
  // get data from form and add to cgs array then redirect back to the cgs page
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
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
app.get('/campgrounds/:id', function(req, res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground});
    }
  })
});

// =======================================================
//       COMMENTS ROUTES
// =======================================================

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground.id);
        }
      })
    }
  })
});

// AUTH ROUTES
app.get('/register', function(req, res){
  res.render('register');
});
app.post('/register', function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register')
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/campgrounds');
    });
  });
});

// Login
app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), function(req, res){

});

// Logout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}



app.listen(3000, '127.0.0.1', function(){
  console.log('The Campapp server has started!')
})

// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log('The CampApp server has started!')
// });
