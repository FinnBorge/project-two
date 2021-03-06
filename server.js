var express  = require('express'),
    PORT     = process.env.PORT || 3000,
    MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    server   = express(),
    dbname   = "wiki",
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    expressLayouts = require('express-ejs-layouts'),
    marked = require('marked'),
    session = require('express-session'),
    User = require('./models/user.js'),
    bcrypt = require('bcryptjs');
    //bcrypt = require('bcrypt');

/* Constant Handlers */
var config = require('./config/config.js');
var tags = config.tags;
var categories = config.categories;
var uniqueTags = []; //stretch goal, populate with custom tags that have been used once
var localConstants = function(req, res, next){
    res.locals.tags = tags;
    res.locals.categories = categories;
    next();
};
/* Constant Handlers END */


/* middleware */
server.set('views', './views');
server.set('view engine', 'ejs');
server.use(express.static('./public'));
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(methodOverride("_method"));
server.use(expressLayouts);
server.use(session({
  secret: 'wikipopo',
  resave: false,
  saveUninitialized: true,
}));
/* Custom Middleware */
/*NEW FRIDAY*/
server.use(function(req, res, next){
  tags = config.tags;
  categories = config.categories;
  next();
});

server.use(localConstants);

server.use(function (req, res, next) {
    res.locals.flash  = req.session.flash || {};
    req.session.flash = {};
    next();
});



server.use(function(req, res, next){
  if(req.session.user){
    res.locals.user = req.session.user;
  } else {
    res.locals.user = "derp";
  }
  next();
});
/* Custom Middleware End */


/* set controllers */
var articleRouter = require('./controllers/article.js');
server.use('/article', articleRouter);

var userRouter = require('./controllers/user.js');
server.use('/user', userRouter);

/* Connect to Database */
mongoose.connect(MONGOURI + "/" + dbname);
/* Set Constants */


/* NEW FRIDAY */
var Article = require('./models/article.js');
Article.find({}, function(err, articles){
  articles.forEach(function(article){
    if(categories.indexOf(article.category) === -1){
      config.categories.push(article.category);
    }
    var articleTags = article.tags;
    articleTags.forEach(function(tag){
      if(tags.indexOf(tag) === -1){
        config.tags.push(tag);
      }
    });
  });
});
/* END NEW FRIDAY */


/* Routes */
server.get('/', function(req, res, next){
  res.redirect(302, '/article/index');
});


server.listen(PORT, function(){
  console.log("SERVER IS UP ON PORT:", PORT);
});
