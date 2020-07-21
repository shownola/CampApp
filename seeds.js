var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [

  {name: 'Canyon Lake Campgrounds', image: 'https://www.knau.org/sites/knau/files/201911/lake_pleasant.jpeg', description: "Less than an hour drive from Phoenix at an elevation of 1,660 feet lies the unspoiled beauty of Canyon Lake.  Here, you'll revel in a playground with more than 28 miles of cactus-dotted shoreline, explore wondrous rock formations, discover peaceful private coves and spot countless species of birds, Big Horn sheep, deer, and javelina roaming freely through the landscape.  Best of all, you'll find new meaning in the spectacular Arizona sunsets that paint the canyon walls aglow.", author: {
    id: "588c2e092403d111454fff76",
    username: 'Jack'
  }},
  {name: 'Lake Pleasant Camping', image: 'https://www.arizona-leisure.com/gfx/lake-pleasant-az-photo.jpg', description: "Just 45 minutes from downtown Phoenix, Pleasant Harbor is the closest entrance to Lake Pleasant.  Open to the public 365 days a year, Pleasant Harbor is a full service marina, RV Park and features Dillon’s restaurant, The Phoenix Boat Cruise and an array of boat and water sport rentals, and a waterslide", author: {
    id: '588c2e092403d111454fff71',
    username: 'Jill'
  }},
  {name: "Cloud's Rest", image: 'https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350', description: 'Enjoy spectacular panoramic views including Yosemite Valley and Little Yosemite Valley from Clouds Rest. Make this an overnight with a scenic stay Sunrise Lakes.', author: {
    id: '588c2e092403d111454fff77',
    username: 'Jane'
  }},
]

// function seedDB(){
//   Campground.deleteMany({}, function(err){
//     if(err){
//       console.log(err);
//     }
//     console.log('Removed Campgrounds');
//     Comment.deleteMany({}, function(err){
//       if(err){
//         console.log(err);
//       }
//       console.log('removed comments');
//       data.forEach(function(seed){
//         Campground.create(seed, function(err, campground){
//           if(err){
//             console.log(err);
//           } else {
//             console.log('Added a campground');
//             Comment.create({
//               text: 'This place was great except that there was no internet', author: 'Homer'
//             }, function(err, comment){
//               if(err){
//                 console.log(err);
//               } else {
//                 campground.comments.push(comment);
//                 campground.save();
//                 console.log('Created new comment');
//
//               }
//             });
//           }
//           });
//
//       });
//     })
//   });
// }

function seedDB(){
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
      console.log('Removed Campgrounds!!');
    }
  });
}
// function seedDB(){
//   Campground.remove({}, function(err){
//     if(err){
//       console.log('err');
//     }
//     console.log('removed campgrounds!')
//   });
//   data.forEach(function(seed){
//     Campground.create(seed, function(err, data){
//       if(err){
//         console.log(err);
//       } else {
//         console.log('Added Campground');
//       }
//     })
//   });
//
// }

module.exports = seedDB;
