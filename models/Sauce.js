const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true,
  },
  mainPepper: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  heat: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  dislikes: {
    type: Number,
    required: true,
  },
  usersLiked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
  usersDisliked: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  },
});

module.exports = mongoose.model('Sauce', sauceSchema);
