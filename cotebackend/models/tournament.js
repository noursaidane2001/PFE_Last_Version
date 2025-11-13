const mongoose = require('mongoose');
const User = require('../models/user');
const Chat = require('../models/chat');
const tournamentSchema = new mongoose.Schema({
  title: {
    type: String
  },
  jeux: {
    type: String
  },
  nbparticipants: {
    type: Number,
    required: [true, 'mention the number of participants']
  },
  date: {
    type: Date,
    required: [true, 'mention tournament date']
  },
  link: {
    type: String,
    required: [true, 'mention discord link']
  },
  photo: {
    type: String,
    default: 'defaulttournament.jpg'
  },
  youtubelink: {
    type: String
  },
  participantid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    required: [true, 'mention tournament description']
  },
  idcreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  created_At: {
    type: Date,
  }

});

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;