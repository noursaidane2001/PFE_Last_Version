const mongoose = require('mongoose');
const Live = require('./live');
const Tournament = require('./tournament');
const User = require('./user');
const chatSchema = new mongoose.Schema({
  idlive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Live",
  },
  idtournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  },
  messages: [{
     message: {
        type: String,
    },
    idsender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    created_At: {
        type: Date,
        default: Date.now
      }

  }],
  isOpen:{
    type: Boolean,
    default : true
  }
});
const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;