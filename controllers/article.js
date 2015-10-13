var express = require('express'),
    router  = express.Router(),
    Article = require('../models/article.js');

router.get('/', function (req, res) {
  Article.find({}, function (err, allArticles) {
    res.render('articles/index', {
      articles: allArticles
    });
  });
});

router.get('/new', function (req, res) {
  // article new FORM page
  res.render('article/new');
});

/* Handle incoming user creation form data */
router.post('/', function(req, res){
  console.log(req.body);
  var newArticle = new Article({
    title: req.body.article.title,
    body: req.body.user.email,
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

router.get('/:id', function (req, res) {
  // show particular article
});

router.get('/:id/edit', function (req, res) {
  // edit article action
});

router.patch('/:id', function (req, res) {
  // update article action REDIRECT
});

router.delete('/:id', function (req, res) {
  // delete article action + REDIRECT  --  ADMIN ONLY
});

module.exports = router;
