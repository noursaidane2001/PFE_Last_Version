const mongoose = require('mongoose');
const User = require('../models/user');
const liveSchema = new mongoose.Schema({
  title: {
    type: String
  },
  youtubelink: {
    type: String,
    required: [true, 'mention the stream link']
  },

  jeux: {
    type: String,
  },
  duration: {
    type: Number,
    // default: 10,
  },
  creatorid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'mention the user creating this live']
  },
  created_At: {
    type: Date,
  },
  islive: {
    type: Boolean,
    default: true
  },
  chat:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  }
});


const Live = mongoose.model('live', liveSchema);

module.exports = Live;