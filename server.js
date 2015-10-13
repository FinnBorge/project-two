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
    expSession = require('express-session'),
    bcrypt = require('bcrypt');

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

/* set controllers */
var articleRouter = require('./controllers/article.js');
server.use('/article', articleRouter);

var userRouter = require('./controllers/user.js');
server.use('/user', userRouter);

mongoose.connect(MONGOURI + "/" + dbname);

// /* If there is no id property inside of req.session, then redirect to /welcome
// otherwise, store it in locals and continue*/
// server.use(function(req, res, next){
//   if(req.session.id === undefined){
//     res.redirect(302, '/welcome');
//   } else {
//     res.locals.id = req.session.id;
//     next();
//   }
// });

server.get('/welcome', function(req, res, next){
  res.render('welcome'); //contains the user name input form
});

server.post('/welcome', function(req, res, next){
  /*find the user based on their entered username.
  test the password against db password
  **make username unique in the create profile */
  res.redirect(302, '/');
});

server.get('/user/new', function(req, res, next){
  res.locals.user = undefined;
  res.render('newprofile');
});


server.get('/test', function(req, res){
  res.write("Wiki Test");
  res.end();
});

server.listen(PORT, function(){
  console.log("SERVER IS UP ON PORT:", PORT);
});
