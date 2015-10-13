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

router.post('/', function (req, res) {
  // article create action + REDIRECT
  console.log(req.body);

  Cat.new(req.body.cat, function (err, newCat) {
    if (err) {
      res.redirect(302, '/cats/new');
    } else {
      res.redirect(302, '/cats');
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
