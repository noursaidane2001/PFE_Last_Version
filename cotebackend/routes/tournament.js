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

// Getting all tournaments
router.get('/all-tournament', tournamentController.tournament_get);

// Getting tournament by id
router.get('/:id', tournamentController.tournamentid_get);

// Delete tournament
router.delete('/:id', tournamentController.tournamentid_delete);

// Delete all tournament
router.delete('/', tournamentController.tournamentid_deleteall);

// Participation routes
router.post('/participate/:id', tournamentController.tournamentid_participate);
router.post('/unparticipate/:id', tournamentController.tournamentid_unparticipate);
router.get('/participating/:id', tournamentController.participatingtournaments_get);
router.get('/createdtournaments/:id', tournamentController.createdtournaments_get);
router.get('/all-user-tournaments/:id', tournamentController.alltournaments_get);

// Configuration sécurisée du stockage multer
const mystorage = multer.diskStorage({
  destination: 'uploads/tournament',

  filename: (req, file, callback) => {
    // Générer un timestamp unique
    const timestamp = Date.now();

    // Liste blanche des extensions autorisées
    const allowedExtensions = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    };

    // Obtenir l'extension sécurisée depuis la liste blanche
    const safeExtension = allowedExtensions[file.mimetype];

    // Rejeter si le type MIME n'est pas dans la liste blanche
    if (!safeExtension) {
      return callback(new Error('Type de fichier invalide. Seules les images sont autorisées.'));
    }

    // Construire le nom de fichier sécurisé
    const safeFilename = `${timestamp}.${safeExtension}`;

    // Stocker dans req.body pour utilisation ultérieure
    req.body.photo = safeFilename;

    callback(null, safeFilename);
  }
});

// Configuration de multer avec validation supplémentaire
const upload = multer({
  storage: mystorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  },
  fileFilter: (req, file, callback) => {
    // Double vérification du type MIME
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Seuls les fichiers image sont autorisés'));
    }
    callback(null, true);
  }
});

// Updating the tournament method
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      nbparticipants,
      jeux,
      link,
      date,
      description,
      youtubelink,
      photo
    } = req.body;

    const updated = await Tournament.findById(id);

    if (!updated) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Objet pour stocker les mises à jour
    const updateData = {};

    if (title) {
      updateData.title = title;
    }

    if (nbparticipants) {
      updateData.nbparticipants = nbparticipants;
    }

    if (jeux) {
      updateData.jeux = jeux;
    }

    if (link) {
      updateData.link = link;
    }

    if (description) {
      updateData.description = description;
    }

    if (date) {
      updateData.date = date;
    }

    if (youtubelink) {
      const exists = await videoExists.videoExists(youtubelink);
      if (exists) {
        updateData.youtubelink = youtubelink;
      } else {
        return res.status(400).json({
          message: 'The youtube video link is invalid'
        });
      }
    }

    if (req.body.photo) {
      updateData.photo = req.body.photo;
    }

    // Une seule mise à jour au lieu de plusieurs
    await Tournament.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Tournament updated successfully' });

  } catch (err) {
    console.error('Error updating tournament:', err);
    res.status(400).json({ error: err.message });
  }
});

// Creating tournament method
router.post('/create-tournament', upload.single('photo'), async (req, res) => {
  try {
    const {
      title,
      nbparticipants,
      jeux,
      link,
      description,
      youtubelink,
      date,
      photo
    } = req.body;

    const newtour = new Tournament();
    newtour.created_At = new Date();

    if (title) {
      newtour.title = title;
    }

    if (nbparticipants) {
      newtour.nbparticipants = nbparticipants;
    }

    if (jeux) {
      newtour.jeux = jeux;
    }

    if (link) {
      newtour.link = link;
    }

    if (description) {
      newtour.description = description;
    }

    if (date) {
      newtour.date = date;
    }

    if (youtubelink) {
      const exists = await videoExists.videoExists(youtubelink);
      if (exists) {
        newtour.youtubelink = youtubelink;
      } else {
        return res.status(400).json({ message: 'Invalid youtube link' });
      }
    }

    if (req.body.photo) {
      newtour.photo = req.body.photo;
    }

    // Créer le chat associé
    const chat = new Chat({
      idtournament: newtour._id
    });

    const user = currentUser(req.headers.authorization);

    newtour.chat = chat._id;
    newtour.idcreator = user;

    // Sauvegarder les deux documents
    await newtour.save();
    await chat.save();

    res.status(201).json(newtour);

    // Récupérer le tournoi avec les données du créateur
    const tour = await Tournament.findById(newtour._id).populate('idcreator');
    console.log('Tournament created:', tour);

  } catch (err) {
    console.error('Error creating tournament:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;