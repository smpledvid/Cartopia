var express = require('express');
var router = express.Router({mergeParams: true});
var Car = require('../models/vehicle');
var Comment = require('../models/comment');

// COMMENTS
router.get("/new", isLoggedIn, function(req, res) {
  // res.send("THIS WILL BE THE COMMENT FORM");
  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {console.log(err);}
    else {
        res.render("comments/new.ejs", {vehicle: foundVehicle});
    }
  });
});

router.post("/", isLoggedIn, function(req, res) {

  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {
      console.log(err);
      res.redirect("/vehicles");
    } else {
      console.log(req.body.comment);
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          
          foundVehicle.comments.push(comment);
          foundVehicle.save();

          res.redirect("/vehicles/" + foundVehicle._id)
        }
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
