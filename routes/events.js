var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var middleware = require('../middleware');

// INDEX - show all events
router.get('/', function(req, res) {
  // Get all events from DB
  Event.find({}, function(err, allEvents) {
    if (err) {
      console.log(err);
    } else {
      res.render('events/index', { events: allEvents });
    }
  });
});

// NEW - show form to create new event
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('events/new');
});

// CREATE - add new event to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
  // Get data from form and create new event
  var name = req.body.name;
  var image = req.body.image;
  var location = req.body.location;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newEvent = { name: name, image: image, location: location, description: description, author: author };
  // Create new event and save to DB
  Event.create(newEvent, function(err, newlyCreatedEvent) {
    if (err) {
      console.log(err);
    } else {
      // Redirect back to events page
      res.redirect('/events');
    }
  });
});

// SHOW - show more details about an event
router.get('/:id', function(req, res) {
  // Find event with id
  Event.findById(req.params.id).populate('comments').exec(function(err, event) {
    if (err) {
      console.log(err);
    } else {
      // Render the event page
      res.render('events/show', { event: event });
    }
  });
});

// EDIT - edit details of event
router.get('/:id/edit', middleware.checkEventOwnership, function(req, res) {
  Event.findById(req.params.id, function(err, event) {
    res.render('events/edit', { event: event });
  });
});

// UPDATE - save edited details of event
router.put('/:id', middleware.checkEventOwnership, function(req, res) {
  // Find and update event
  Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, event) {
    if (err) {
      res.redirect('/events');
    } else {
      res.redirect('/events/' + req.params.id);
    }
  });
});

// DELETE - delete event
router.delete("/:id", middleware.checkEventOwnership, function(req, res) {
  Event.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/events');
    } else {
      res.redirect('/events');
    }
  });
});

module.exports = router;
