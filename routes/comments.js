var express = require('express');
var router = express.Router({ mergeParams: true });
var Event = require('../models/event');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// NEW - show form to create comment
router.get('/new', middleware.isLoggedIn, function(req, res) {
  // Find event by middleware
  Event.findById(req.params.id, function(err, event) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { event: event });
    }
  });
});

// CREATE - add new comment to event and DB
router.post('/', middleware.isLoggedIn, function(req, res) {
  // Find event with id
  Event.findById(req.params.id, function(err, event) {
    if (err) {
      console.log(err);
      res.redirect('/events');
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash('error', 'Something went wrong - comment not created');
          console.log(err);
        } else {
          // Add id and username to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment
          comment.save();
          event.comments.push(comment);
          event.save();
          req.flash('success', 'Comment successfully added');
          res.redirect('/events/' + event._id);
        }
      });
    }
  });
});

// EDIT - edit comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, comment) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { event_id: req.params.id, comment: comment });
    }
  });
});

// UPDATE - update comment
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/events/' + req.params.id);
    }
  });
});

// DELETE - delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
  // Find comment by id and delete
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/events/' + req.params.id);
    }
  });
});

module.exports = router;
