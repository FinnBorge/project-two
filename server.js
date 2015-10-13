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

/* Routes */
server.get('/', function(req, res, next){
  res.render('article/index', {});
});


server.listen(PORT, function(){
  console.log("SERVER IS UP ON PORT:", PORT);
});
