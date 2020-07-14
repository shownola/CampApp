var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser');

const mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/camp_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// mongoose.connect('mongodb://localhost/camp_app');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');




// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({name: 'Salmon Creek', image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350", description: 'A scenic 150-acre Civil War era farm is graced with a perfect mix of woodlands, tree-dotted meadows and grassy rolling hills. Regardless of your personal definition of camping, you will always find precisely what you need at Granite Hill. GHCR offers private tent sites, spacious pull-thru sites catering to the largest RVs and Big Rigs, as well as a wide range of options in group camping and rustic cabins in a wooded setting'},  function(err, campground){
//   if(err){
//     console.log(err);
//   } else {
//     console.log('NEWLY CREATED CAMPGROUND');
//     console.log(campground);
//   }
// });



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
  // res.render('campgrounds', {campgrounds:campgrounds});
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
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render('show', {campground: foundCampground})
    }
  })
});




app.listen(3000, '127.0.0.1', function(){
  console.log('The Campapp server has started!')
})

// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log('The CampApp server has started!')
// });
