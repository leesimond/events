var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Event = require('./models/event');
var Comment = require('./models/event');
var User = require('./models/user');

var PORT = 8080;

// Routes
var indexRoutes = require('./routes/index');
var eventRoutes = require('./routes/events');
var commentRoutes = require('./routes/comments');

mongoose.connect('mongodb://localhost/events');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport configuration
app.use(require('express-session')({
  secret: 'Melbourne has a lot of interesting events',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes); 
app.use('/events', eventRoutes);
app.use('/events/:id/comments', commentRoutes);

app.listen(PORT, 'localhost', function() {
  console.log("Server has started on port: " + PORT);
});