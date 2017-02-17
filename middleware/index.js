var Event = require('../models/event');
var Comment = require('../models/comment');

var middlewareObj = {};

var NO_PERMISSION_MSG = "You don't have permission to do that";
var LOGIN_REQUIRED_MSG = 'You must be logged in to do that';

middlewareObj.checkEventOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Event.findById(req.params.id, function(err, foundEvent) {
      if (err) {
        req.flash('error', 'Event not found');
        res.redirect('back');
      } else {
        // Check if user is creator of event
        if (foundEvent.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', NO_PERMISSION_MSG);
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', LOGIN_REQUIRED_MSG);
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        // Check if user is creator of comment
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', NO_PERMISSION_MSG);
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', LOGIN_REQUIRED_MSG);
    res.redirect('back');
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', LOGIN_REQUIRED_MSG);
  res.redirect('/login');
}

module.exports = middlewareObj;