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

router.get('/index', function(req, res){
  Article.find({}, function(err, allArticles){
    if(err){
      console.log(err);
      res.redirect(302, '/');
    } else {
      res.render('article/index', {
        articles: allArticles
      });
    }
  });
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
      author: req.session.user.name,
      authorId: req.session.user._id
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

/* View get Route */
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

/* EDIT get Route */
router.get('/edit/:id/', function (req, res) {
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log("Error");
      res.redirect(302, '/view/' + req.params.id);
    }else{
      res.render('article/edit', {
          article: article
      });
    }
  });
});

/* method override sends the post ?_method="PATCH" to this */
router.patch('/:id', function (req, res) {
  // update article action REDIRECT
  if(req.session.user){}else{res.redirect(302, '/user/login');}
  console.log(req.body);
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log("Error");
      res.redirect(302, '/edit/' + req.params.id);
    }else{
      var edited = req.body.article;
      article.edits.unshift({ //this means the most recent is always index:0
        editor: req.session.user.name,
        editorId: req.session.user._id,
        editedArticle: edited,
        meta:{
          upvotes: 0,
          downvotes: 0
        }
      });
      article.save(function(err, editedarticle){ //findbyidandUpdate
        if(err){
          console.log(err);
          res.redirect(302, '/edit/' + article._id);
        } else {
            /* gotta show the edit, maybe compare against original? voting system*/
          console.log(article);
          res.redirect(302, '/article/view/' + editedarticle._id);
        }
      });
    } /* closes Else */
  }); /* closes Article.findById*/
}); /* closes route */

router.delete('/view/:id', function (req, res) {
  // delete article action + REDIRECT  --  ADMIN ONLY
});

module.exports = router;
