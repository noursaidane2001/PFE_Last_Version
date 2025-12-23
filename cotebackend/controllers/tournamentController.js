const Tournament = require('../models/tournament');
const asyncHandler = require("express-async-handler");
const { validateVideoId,
  getVideoDetails } = require('../middleware/YoutubeApi');
const User = require('../models/user');
const { userbyid } = require('./userController');
const { currentUser } = require('../middleware/currentUser');
const Reclamation = require('../models/reclamation');
const Chat = require('../models/chat');
function handleErrors(err) {
  let errors = { title: 'incorrect title', jeux: 'incorrect name of game', nbparticipants: 'incorrect nbparticipants', date: 'incorrect date', link: 'incorrect link', photo: 'incorrect photo' };
  console.log(err.message, err.code);
  if (err.message == 'incorrect title') {
    errors.title = 'title not registred';
  }
  if (err.message == 'incorrect name of game') {
    errors.jeux = 'incorrect name of game';
  }
  if (err.message == 'incorrect nbparticipants') {
    errors.nbparticipants = 'incorrect nbparticipants';
  }
  if (err.message == 'incorrect date') {
    errors.date = 'incorrect date';
  }
  if (err.message == 'incorrect link') {
    errors.link = 'incorrect link';
  }
  if (err.message == 'incorrect photo') {
    errors.photo = 'incorrect photo';
  }
  return (errors);
}

module.exports.tournament_get = async (req, res) => {
  try {
    const tours = await Tournament.find().populate('participantid').populate('idcreator')
    res.status(200).send(tours);
  } catch (err) {
    res.status(400).send(err)
  }
};
module.exports.tournamentid_get = async (req, res) => {
  try {
    const tour = await Tournament.findById(req.params.id).populate('participantid').populate('idcreator')
    res.status(200).send(tour)
  } catch (err) {
    res.status(400).send(err)
  }
};

module.exports.tournamentid_delete = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    // Valider que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    // Delete the tournament
    const tour = await Tournament.findOneAndDelete({ _id: id });

    await Reclamation.deleteMany({ idtournament: id });

    res.status(200).send(tour);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports.tournamentid_deleteall = async (req, res) => {
  try {
    tours = await Tournament.findAndDelete()
    res.status(200).send(tours)
  }
  catch (err) {
    res.status(400).send(err)
  }
};


module.exports.tournamentid_participate = async (req, res) => {
  try {
    console.log('im here');
    const user = currentUser(req.headers.authorization);
    console.log("this is the user", user);
    const tourna = await Tournament.findById(req.params.id);
    const count = tourna.participantid.length;
    console.log(count);
    if (tourna.nbparticipants <= count) {
      res.status(400).send({ message: 'Sorry, the maximum number of participants has been reached' });
    } else {
      const tour = await Tournament.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { participantid: user } },

        { new: true }
      ).populate('participantid').populate('idcreator');
      console.log(tour);
      res.status(200).send(tour);
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.tournamentid_unparticipate = async (req, res) => {
  try {
    console.log('im here')
    const user = currentUser(req.headers.authorization);
    console.log("i'm the participant", user)
    if (!user) {
      console.log('use not found ')
      return res.status(404).send({ message: 'The user does not exist or is not logged in' });
    }
    const tourna = await Tournament.findById(req.params.id);
    const count = tourna.participantid.length;
    console.log(count);
    const tour = await Tournament.findByIdAndUpdate(
      req.params.id,
      { $pull: { participantid: user } },
      { new: true }
    );

    return res.status(200).send({ message: "The user is no longer participating" });
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.participatingtournaments_get = async (req, res) => {
  try {
    const iduser = req.params.id;

    // Valider que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(iduser)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const tournaments = await Tournament.find({ participantid: iduser });

    return res.status(200).send(tournaments);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.createdtournaments_get = async (req, res) => {
  try {
    const iduser = req.params.id;

    // Vérifier que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(iduser)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Utiliser Mongoose de manière sécurisée
    const tournaments = await Tournament.find({ idcreator: mongoose.Types.ObjectId(iduser) }).exec();

    return res.status(200).json(tournaments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
module.exports.alltournaments_get = async (req, res) => {
  try {
    const iduser = req.params.id;

    // Valider que c'est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(iduser)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const userObjectId = mongoose.Types.ObjectId(iduser);

    const participatingTournaments = await Tournament.find({ participantid: userObjectId });
    const createdTournaments = await Tournament.find({ idcreator: userObjectId });

    const allTournaments = participatingTournaments.concat(createdTournaments);

    return res.status(200).send(allTournaments);
  } catch (err) {
    return res.status(400).send(err);
  }
};


