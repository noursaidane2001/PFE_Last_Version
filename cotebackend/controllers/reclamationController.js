const Reclamation = require('../models/reclamation');
const User = require('../models/user');
const Tour = require('../models/tournament');
const Live = require('../models/live');
const { currentUser } = require('../middleware/currentUser');

module.exports.reclamationTour_create = async (req, res) => {
  try {
    console.log(req.headers['authorization']);
    const user = currentUser(req.headers.authorization);
    console.log("this is the user", user);
    const tour = await Tour.findById(req.params.id);

    if (tour) {
      console.log("hello world", req.body)
      const reclamation = await new Reclamation({
        iduser: user,
        idtournament: req.params.id,
        reclamationbody: req.body.body,
        type: req.body.type
      });
      console.log(tour)
      const result = await reclamation.save();
      res.status(200).send(result);
    }
    else {
      res.status(400).json({ message: 'id invalid' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};
module.exports.reclamationLive_create = async (req, res) => {
  try {
    console.log(req.headers['authorization']);
    const user = currentUser(req.headers.authorization);
    console.log("this is the user", user);
    const live = await Live.findById(req.params.id);
    if (live) {
      const reclamation = await new Reclamation({
        iduser: user,
        idlive: req.params.id,
        reclamationbody: req.body.body,
        type: req.body.type
      });
      const result = await reclamation.save();
      res.status(200).send(result);
    } else {
      res.status(400).json({ message: 'id invalid' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};


module.exports.reclamationTournament_get = async (req, res) => {
  try {
    const reclams = await Reclamation.find({ idtournament: { $ne: null } })
      .populate('idtournament', 'title') // Replace with actual field names of the tournament model
      .populate('iduser', 'firstname'); // Replace with actual field names of the user model

    res.status(200).send(reclams);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.reclamationLive_get = async (req, res) => {
  try {
    const reclams = await Reclamation.find({ idlive: { $ne: null } })
      .populate('idlive', 'title') // Replace with actual field names of the tournament model
      .populate('iduser', 'firstname'); // Replace with actual field names of the user model;

    res.status(200).send(reclams);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.reclamation_byid = async (req, res) => {
  try {
   const reclams = await Reclamation.findById({ _id: req.params.id });
    res.status(200).send(reclams);
  } catch (err) {
    res.status(400).send(err);
  }
};
module.exports.treatreclamation = async (req, res) => {
  try {
   const id = req.params.id;
   const reclam = await Reclamation.findByIdAndUpdate({ _id: id }, { status: 'treated' }, { new: true });

    res.status(200).send(reclam);
  } catch (err) {
    res.status(400).send(err);
  }
};
