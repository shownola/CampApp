var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    seedDB      = require('./seeds');
    // Comment     = require('./models/comment'),
    // Users       = require('./models/user');

seedDB();

mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
// mongoose.connect('mongodb://localhost/camp_app');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', function(req, res){
  res.render('landing');
});

// INDEX - shows all campgrounds
app.get('/campgrounds', function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('index', {campgrounds:allCampgrounds});
    }
  });
});

// NEW - show form to create new campground
app.get('/campgrounds/new', function(req, res){
  res.render('new.ejs')
})

// CREATE CAMPGROUND:
app.post('/campgrounds', function(req, res){
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
      res.render('show', {campground: foundCampground});
    }
  })
});




app.listen(3000, '127.0.0.1', function(){
  console.log('The Campapp server has started!')
})

// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log('The CampApp server has started!')
// });
