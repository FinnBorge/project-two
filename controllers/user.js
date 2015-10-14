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
      res.redirect(302, '/user/view/' + user._id);
      /* successful user creation, view new user page */
    }
  });
});

/* View a particular user :: special permissions if its the current user */
router.get('/view/:id', function(req, res, next){
  console.log("MADE IT");
  User.findById(req.params.id, function(err, dbuser){
    Article.find({authorId: dbuser._id}, function(err, articles){
      if(err){
        console.log("user.findbyid error");
      } else {
        res.render('user/view', {
          user: dbuser,
          userArticles: articles
        });
      }
    });
  });
});

/* View the login form */
router.get('/login', function(req, res, next){
  if(req.session.user){
    res.redirect(302, 'view/' + req.session.user._id);
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
      res.redirect(302, '/user/view/' + dbuser._id);
    } else {
      console.log("email and password do not match");
      //track attempts?
    }
  });
});

router.get('/logout', function(req, res, next){
  req.session.user = null;
  res.redirect(302, '/');
});

module.exports = router;
