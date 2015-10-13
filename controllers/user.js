var express = require('express'),
    router  = express.Router(),
    User = require('../models/user.js'),
    Article = require('../models/article.js');

router.get('/new', function(req, res, next){
  res.locals.user = undefined;
  res.render('user/new');
});

router.post('/', function(req, res){
  var newUser = new User({
    name: req.body.user.name,
    email: req.body.user.email,
    password: req.body.user.password,
    location: req.body.user.location,
  });
  newUser.save(function(err, user){
    if(err){
      console.log(err);
    } else {
      req.session.id = user._id;
      res.redirect(302, '/user/' + user._id);
      console.log("save complete");
    }
  });
  //creation of the user
});

router.get('/:id', function(req, res, next){
  res.render('user/view');
});


module.exports = router;
