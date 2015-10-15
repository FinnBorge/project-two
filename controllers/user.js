var express = require('express'),
    router  = express.Router(),
    User = require('../models/user.js'),
    Article = require('../models/article.js'),
    bcrypt = require('bcryptjs');

/* Serve user creation form page */
router.get('/new', function(req, res, next){
  res.locals.user = {};
  res.render('user/new');
});

/* Handle incoming user creation form data */
router.post('/', function(req, res){
  var password = req.body.user.password;
  User.findOne({ email: req.body.user.email }, function (err, user) {
    if (err) {

    } else if (user) {
      req.session.flash.message = "Email in use";
      res.redirect(302, '/users/new');
    } else {
      bcrypt.genSalt(10, function (saltErr, salt) {
        bcrypt.hash(password, salt, function (hashErr, hash) {
          var newUser = new User({
            name: req.body.user.name,
            email: req.body.user.email,
            location: req.body.user.location,
            passwordHash: hash
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
      });
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
          dbuser: dbuser,
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
      req.session.flash.message = "Some error has occured";
    } else if (dbuser){
      console.log("dbuser found");
      console.log(password);
      console.log(dbuser.passwordHash);
      bcrypt.compare(password, dbuser.passwordHash, function (compareErr, match) {
        if(match){
          req.session.flash.message = "Log-in successful";
          req.session.user = dbuser;
          res.redirect(302, '/user/view/' + dbuser._id);
        } else {
          req.session.flash.message = "Email and password do not match";
          res.redirect(302, '/user/login');
        }
      });
    }
  });
});

router.get('/logout', function(req, res, next){
  req.session.user = null;
  req.session.flash.message = "Thank you for logging out";
  res.redirect(302, '/');
});

module.exports = router;
