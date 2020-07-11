var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
  {name: 'Salmon Creek', image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: 'Granite Hill', image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: 'Mountain Goat Rest', image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: 'Salmon Creek', image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: 'Granite Hill', image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: 'Mountain Goat Rest', image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
];

app.get('/', function(req, res){
  res.render('landing');
});

app.get('/campgrounds', function(req, res){

  res.render('campgrounds', {campgrounds:campgrounds});
});

app.get('/campgrounds/new', function(req, res){
  res.render('new.ejs')
})

app.post('/campgrounds', function(req, res){
  // get data from form and add to cgs array then redirect back to the cgs page
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);

  res.redirect('/campgrounds');

});




app.listen(3000, '127.0.0.1', function(){
  console.log('The Campapp server has started!')
})

// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log('The CampApp server has started!')
// });
