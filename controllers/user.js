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
      res.redirect(302, '/user/' + user._id);
    }
  });
  //creation of the user
});

router.get('/:id', function(req, res, next){
  Article.findById(req.params.id, function (err, allArticles) {
    res.render('user/view', {
      articles: allArticles || "No Articles!"
    });
  });
});

module.exports = router;
