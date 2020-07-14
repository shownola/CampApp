var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser');

const mongoose  = require('mongoose');


mongoose.connect('mongodb://localhost/camp_app');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


// mongoose.connect('mongodb://localhost:27017/db_name', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({name: 'Salmon Creek', image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"}, function(err, campground){
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

app.get('/campgrounds', function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds', {campgrounds:allCampgrounds});
    }
  });
  // res.render('campgrounds', {campgrounds:campgrounds});
});

app.get('/campgrounds/new', function(req, res){
  res.render('new.ejs')
})

app.post('/campgrounds', function(req, res){
  // get data from form and add to cgs array then redirect back to the cgs page
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
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




app.listen(3000, '127.0.0.1', function(){
  console.log('The Campapp server has started!')
})

// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log('The CampApp server has started!')
// });
