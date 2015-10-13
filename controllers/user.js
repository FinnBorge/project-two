var express = require('express'),
    router  = express.Router(),
    User = require('../models/user.js');

router.get('/user/new', function(req, res, next){
  res.locals.user = undefined;
  res.render('user/new');
});

router.post('/user', function(req, res){
  //creation of the user
});

module.exports = router;
