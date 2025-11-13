const mongoose = require('mongoose');
const User = require('../models/user');
const Tournament = require('../models/tournament');
const Live = require('../models/live');
const reclamationSchema = new mongoose.Schema({
  iduser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true,'mention user reclaming']
},
idtournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament"
},
idlive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Live"
},
 reclamationbody:{
        type: String,
        required :[true,'mention your reclamation']
    },
type:{
    type : String,
    enum: ['rule Violations','technical Issues','streaming Quality']
},
status: {
    type: String,
    enum: ['untreated', 'treated'],
    default: 'untreated'
  }
});

const Reclamation= mongoose.model('reclamation', reclamationSchema );

module.exports = Reclamation;