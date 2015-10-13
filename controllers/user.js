var express = require('express'),
    router  = express.Router(),
    User = require('../models/user.js'),
    Article = require('../models/article.js');

/* Serve user creation form page */
router.get('/new', function(req, res, next){
  res.locals.user = undefined;
  res.render('user/new');
});

/* Handle incoming user creation form data */
router.post('/', function(req, res){
  console.log(req.body);
  var newUser = new User({
    name: req.body.user.name,
    email: req.body.user.email,
    password: req.body.user.password,
    location: req.body.user.location,
  });
  newUser.save(function(err, user){
    if(err){
      console.log(err);
      res.redirect(302, '/user/new');
      /* failed user creation, add flash */
    } else {
      req.session.user = user;
      res.redirect(302, '/user/view' + req.session.user._id);
      /* successful user creation, view new user page */
    }
  });
});

/* View a particular user :: special permissions if its the current user */
router.get('/view', function(req, res, next){
  console.log("MADE IT");
  res.render('user/view');
});

/* View the login form */
router.get('/login', function(req, res, next){
  if(req.session.user){
    res.redirect(302, 'user/view');
  } else {
    res.render('user/login', {});
  }
});

/* Handle incoming login information */
router.post('/login', function(req, res, next){
  var email = req.body.user.email.toLowerCase();
  var password = req.body.user.password;
  console.log(req.body.user);
  User.findOne({email: email}, function(err, dbuser){
    console.log(dbuser);
    if(err){
      res.redirect(302, '/welcome');//flash error
    } else if (password === dbuser.password){
      console.log("Log-in successful");
      req.session.user = dbuser; //hide pw
      res.redirect(302, '/user/view');
    } else {
      console.log("email and password do not match");
      //track attempts?
    }
  });
});

module.exports = router;
