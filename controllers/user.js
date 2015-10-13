var express = require('express'),
    router  = express.Router(),
    User = require('../models/user.js'),
    Article = require('../models/article.js');

router.get('/new', function(req, res, next){
  res.locals.user = undefined;
  res.render('user/new');
});

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
    } else {
      req.session.user = user;
      res.redirect(302, '/user/' + req.session.user._id);
    }
  });
});

router.get('/view', function(req, res, next){
  console.log("MADE IT");
  res.render('user/view');
});


module.exports = router;
