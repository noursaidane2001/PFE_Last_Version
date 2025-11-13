const Tournament = require('../models/tournament');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tournamentController = require('../controllers/tournamentController');
const multer = require('multer');
const videoExists = require('../middleware/YoutubeApi');
const { checkUser } = require('../middleware/authMiddleware');
const { currentUser } = require('../middleware/currentUser');
const Chat = require('../models/chat');
//getting all tournaments
router.get('/all-tournament', tournamentController.tournament_get);
//getting tournament by id
router.get('/:id', tournamentController.tournamentid_get);
//delete tournament
router.delete('/:id', tournamentController.tournamentid_delete);
//delete all tournament
router.delete('/', tournamentController.tournamentid_deleteall);
//participation routes
router.post('/participate/:id', tournamentController.tournamentid_participate);
router.post('/unparticipate/:id', tournamentController.tournamentid_unparticipate);
router.get('/participating/:id', tournamentController.participatingtournaments_get);
router.get('/createdtournaments/:id', tournamentController.createdtournaments_get);
router.get('/all-user-tournaments/:id',tournamentController.alltournaments_get);


const mystorage = multer.diskStorage({
  destination: 'uploads/tournament', //'uploads/tournaments'
  filename: (req, file, redirect) => {
    //nom unique  par le temp
    let date = Date.now();
    // image/png
    let f1 = date + '.' + file.mimetype.split('/')[1];
    redirect(null, f1);

    req.body.photo = f1
  }
})
//middleware entre l'appel du request et la fonction de creation
const upload = multer({ storage: mystorage });
// updating the tournament method
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const id = req.params.id;
    const { title,
      nbparticipants,
      jeux,
      link,
      date,
      description,
      youtubelink,
      photo } = req.body;
    const updated = await Tournament.findById(id);
    if (!updated) {
      return res.status(404).json({ message: 'Tournament not found' });
    } else {
      if (title) {
        // updated.title = title;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { title: title }, { new: true });
        console.log("helloTitle")
      }
      if (nbparticipants) {
        // updated.nbparticipants = nbparticipants;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { nbparticipants: nbparticipants }, { new: true });
      }
      if (jeux) {
        // updated.jeux = jeux;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { jeux: jeux }, { new: true });
      }
      if (link) {
        // updated.link = link;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { link: link }, { new: true });
      }
      if (description) {
        // updated.description = description;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { description: description }, { new: true });
      }
      if (date) {
        // updated.description = description;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { date: date }, { new: true });
      }
      if (youtubelink) {
        const exists = await videoExists.videoExists(youtubelink);
        if (exists) {
          // updated.youtubelink = youtubelink;
          const updatedTour = await Tournament.findByIdAndUpdate({
            _id: id
          }, { youtubelink: youtubelink }, { new: true });
        } else {
          return res.status(400).json({
            message: 'The youtube video link is invalid'
          });
        }
      }
      console.log("hii photo", photo)
      if (req.body.photo) {
        // updated.photo = filename1;
        const updatedTour = await Tournament.findByIdAndUpdate({
          _id:
            id
        }, { photo: photo }, { new: true });
      }
      // await updated.save();
      res.status(200).json({ message: 'Tournament updated successfully' });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
//  creating tournament method
router.post('/create-tournament', upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    const exists = await videoExists.videoExists(data.youtubelink);
    const { title,
      nbparticipants,
      jeux,
      link,
      description,
      youtubelink,
      date,
      photo } = req.body;
    const newtour = await new Tournament;
    newtour.created_At = new Date();
    if (title) {
      // updated.title = title;
      newtour.title = title;
      console.log("helloTitle")
    }
    if (nbparticipants) {
      // updated.nbparticipants = nbparticipants;
      newtour.nbparticipants = nbparticipants;
      console.log("helloTitle2")
    }
    if (jeux) {
      // updated.jeux = jeux;
      newtour.jeux = jeux;
      console.log("helloTitle")
    }
    if (link) {
      // updated.link = link;
      newtour.link = link;
      console.log("helloTitle")
    }
    if (description) {
      // updated.description = description;
      newtour.description = description;
      console.log("helloTitle")
    }
    if (date) {
      // updated.description = description;
      newtour.date = date;
      console.log("helloTitle")
    }
    if (youtubelink) {
      const exists = await videoExists.videoExists(youtubelink);
      console.log("videioo")
      if (exists) {
        // updated.youtubelink = youtubelink;
        newtour.youtubelink = youtubelink;
        console.log("videioo11")
      } else {
        console.log('invalid youtube link')
        return res.status(400).json({ message: 'invalid youtube link' });
      }
    }
    console.log(photo)
    if (req.body.photo) {
      // updated.photo = filename1;
      newtour.photo = req.body.photo;
    }
    const chat = new Chat({
      idtournament: newtour._id,
      // idsender: req.headers['authorization'],
      // message: 'Welcome to the tournament chat!'
    });
    const user = currentUser(req.headers.authorization);
    console.log("this is the user", user);

    newtour.chat = chat._id;
    newtour.idcreator = user
    newtour.save();
    chat.save();
    console.log(req.headers['authorization']);
    //  await query.exec();
    console.log(user);
    // newtour.save();
    res.status(201).json(newtour);
    const tour = await Tournament.findById(newtour._id).populate('idcreator');
    console.log(tour);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;