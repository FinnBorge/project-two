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
  if(req.session.user){
    var newArticle = new Article({
      title: req.body.article.title,
      body: req.body.article.body,
      category: req.body.article.category,
      tags: req.body.article.tags,
      author: req.session.user.email
    });
    newArticle.save(function(err, article){
      if(err){
        console.log(err);
        res.redirect(302, '/article/new');
        /* failed article creation, add flash */
      } else {
        res.redirect(302, '/article/view/' + article._id);
        /* successful article creation, view new article page */
      }
    });
  } else {
    res.redirect(302, 'user/login');
  }
});

router.get('/view/:id', function (req, res) {
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log("Error");
      res.redirect(302, '/');
    }else{
      res.render('article/view', {
          article: article
      });
    }
  });
  console.log("You've hit the article + ID page");
});

router.get('view/:id/edit', function (req, res) {
  // edit article action
});

router.patch('view/:id', function (req, res) {
  // update article action REDIRECT
});

router.delete('view/:id', function (req, res) {
  // delete article action + REDIRECT  --  ADMIN ONLY
});

module.exports = router;
