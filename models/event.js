var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  name: String,
  image: String,
  location: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Event', eventSchema);