var express = require('express'),
    router  = express.Router(),
    Article = require('../models/article.js');


/* Fancy Functions */
var upvoteCap = 5;
var downvoteCap = 2;

var voteThreshold = function(article){
  var editUpvotes = article.edits[0].meta.upvotes;
  var editDownvotes = article.edits[0].meta.downvotes;
  if(editUpvotes >= upvoteCap){
    var updatedArticle = article;
    var edited = article.edits[0];
    var editedArticle = article.edits[0].editedArticle;
    var updateDate = new Date();
    updateDate = updateDate.toUTCString();
    updatedArticle.updated = updateDate;
    updatedArticle.editor = edited.editor;
    updatedArticle.editorId = edited.editorId;
    updatedArticle.title = editedArticle.title;
    updatedArticle.tags = editedArticle.tags;
    updatedArticle.category = editedArticle.category;
    updatedArticle.body = editedArticle.body;
    updatedArticle.meta = {
      upvotes: 0,
      downvotes: 0
    };
    updatedArticle.voters = [];
    updatedArticle.edits = [];
    return updateArticle;
  } else if(editDownvotes >= downvoteCap) {
    article.edits.shift();
    article.voters = [];
    article.meta.upvotes = 0;
    article.meta.downvotes = 0;
    return article;
  } else {
    return article;
  }
};


/* Fancy Functions END */

router.get('/', function(req, res){
  Article.find({}, function(err, allArticles){
    if(err){
      console.log(err);
      res.redirect(302, '/');
    } else {
      res.render('article/index', {
        articles: allArticles,
        locals: res.locals
      });
    }
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
        articles: allArticles,
        locals: res.locals
      });
    }
  });
});

/* Handle incoming user creation form data */
router.post('/', function(req, res){
  console.log(req.body);
  if(req.session.user){
    var now = new Date();
    var theDate = now.toUTCString();
    var newArticle = new Article({
      title: req.body.article.title,
      body: req.body.article.body,
      category: req.body.article.category,
      tags: req.body.article.tags,
      author: req.session.user.name,
      authorId: req.session.user._id,
      date: theDate
    });
    newArticle.save(function(err, article){
      if(err){
        console.log(err);
        res.redirect(302, '/article/new');
        /* failed article creation, add flash */
      } else {
        req.session.flash.message = "Thank you " + article.author + " for creating " + article.title + "!";
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

/* TALK get Route */
router.get('/talk/:id', function (req, res) {
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log("Error");
      res.redirect(302, '/');
    }else{
      res.render('article/talk', {
          published: article,
          edited: article.edits[0]
      });
    }
  });
  console.log("You've hit the talk page");
});

router.post('/talk/:id', function (req, res) {
  /*capture the vote and increment the db val*/
  if(req.session.user){
    Article.findById(req.params.id, function(err, article){
      if(err){
        console.log("Error");
        res.redirect(302, '/');
      }else{
        var published = article,
            edited = article.edits[0];
        if(published.voters.indexOf(req.session.user._id) === -1){
            var voteQuality = req.body.vote; // === published || edited
                if(voteQuality === "published"){
                  published.meta.upvotes += 1;
                  edited.meta.downvotes += 1;
                }else if(voteQuality ==="edited"){
                  published.meta.downvotes += 1;
                  edited.meta.upvotes += 1;
                }
                published.voters.push(req.session.user._id);
                /* update article if good enough vote count */
                published = voteThreshold(published);
                published.save(function(err, article){
                  if(err){
                    res.redirect(302, '/');
                  } else {
                    req.session.flash.message = "Vote Submitted";
                    res.redirect(302, '/article/view/' + article._id);
                  }
                });
        } else {
          res.redirect(302, '/');
        }
      }
    });
  } else {
      res.redirect(302, '/');
  }
});

/* method override sends the post ?_method="PATCH" to this */
router.patch('/:id', function (req, res) {
  // update article action REDIRECT
  console.log(req.body);
  if(req.session.user){
    Article.findById(req.params.id, function(err, article){
      if(err){
        console.log("Error");
        res.redirect(302, '/edit/' + req.params.id);
      }else{
        var edited = req.body.article;
        var now = new Date();
        edited.date = now.toUTCString();
        article.edits.push({ //queue
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
            req.session.flash.message = "EDIT Submitted";
            res.redirect(302, '/article/view/' + editedarticle._id);
          }
        });
      } /* closes Else */
    }); /* closes Article.findById*/
  }else{res.redirect(302, '/user/login');}

}); /* closes route */

router.delete('/:id', function (req, res) {
  if(true){
    Article.findById(req.params.id, function(err, article){
      if(err){
        console.log("Error");
        res.redirect(302, '/article/edit/' + req.params.id);
      } else {
        Article.findByIdAndRemove(req.params.id, function(err){
          if(err){
            console.log(err);
          } else {
            req.session.flash.message = "Article Deleted";
            res.redirect(302, '/article/index/');
          }
        });
      }
    });
  } else {
    console.log("How did you get here?");
    res.redirect(302, '/');
  }
});

module.exports = router;
