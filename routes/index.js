var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Root route
router.get('/', function(req, res) {
  res.render('landing');
});

// Show register form
router.get('/register', function(req, res) {
  res.render('register');
});

// Sign up logic
router.post('/register', function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/register');
    }
    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Welcome to Events ' + user.username);
      res.redirect('/events');
    });
  });
});

// Show login form
router.get('/login', function(req, res) {
  res.render('login');
});

// Login logic
router.post('/login', passport.authenticate('local', {      
    successRedirect: '/events',
    failureRedirect: '/login'
  }), function(req, res) {
});

// Logout route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/events');
});

module.exports = router;