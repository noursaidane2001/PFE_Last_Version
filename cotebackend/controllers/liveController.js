const Live = require('../models/live');
const { Livestream } = require('../middleware/livestream');
const { currentUser } = require('../middleware/currentUser');
const Reclamation = require('../models/reclamation');
const Chat = require('../models/chat');
const mongoose = require('mongoose');

module.exports.live_get = async (req, res) => {
  try {
    const liveStream = await Live.find().populate("creatorid");
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Erreur lors de la récupération' });
  }
};

module.exports.live_getnow = async (req, res) => {
  try {
    const liveStream = await Live.find({ islive: true }).populate("creatorid");
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Erreur lors de la récupération' });
  }
};

module.exports.live_getpassed = async (req, res) => {
  try {
    const liveStream = await Live.find({ islive: false }).populate("creatorid");
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Erreur lors de la récupération' });
  }
};

module.exports.live_update = async (req, res) => {
  try {
    // Sécuriser l'ID
    const id = req.params.id.toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Format ID invalide' });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const liveStream = await Live.findByIdAndUpdate(objectId, { islive: false });

    if (!liveStream) {
      return res.status(404).send({ error: 'Live non trouvé' });
    }

    const chat = liveStream.chat;

    if (chat && mongoose.Types.ObjectId.isValid(chat.toString())) {
      const chatObjectId = new mongoose.Types.ObjectId(chat.toString());
      await Chat.findByIdAndUpdate(chatObjectId, { isOpen: false });
    }

    res.status(200).send({ success: true, data: liveStream });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Erreur lors de la mise à jour' });
  }
};

module.exports.live_post = async (req, res) => {
  try {
    // Sécuriser les données d'entrée
    const { title, youtubelink, jeux } = req.body;

    // Validation des champs string
    const safeTitle = title ? title.toString().trim() : null;
    const safeYoutubelink = youtubelink ? youtubelink.toString().trim() : null;
    const safeJeux = jeux ? jeux.toString().trim() : null;

    const user = currentUser(req.headers.authorization);

    if (!user) {
      return res.status(401).send({ error: 'Utilisateur non authentifié' });
    }

    console.log("this is the user", user);

    const newlive = new Live();

    if (safeYoutubelink) {
      const vid = await Livestream(safeYoutubelink);
      console.log(vid);

      if (vid.exists && vid.isLive) {
        newlive.youtubelink = safeYoutubelink;
        const chat = new Chat({
          idlive: newlive._id,
        });
        await chat.save();
        newlive.chat = chat._id;
      } else if (vid.exists && !vid.isLive) {
        console.log('The YouTube video is not live now');
        return res.status(400).json({ message: 'The YouTube video is not live now' });
      } else {
        console.log('The YouTube video link is invalid');
        return res.status(400).json({ message: 'The YouTube video link is invalid' });
      }
    }

    if (safeTitle) {
      newlive.title = safeTitle;
    }

    if (safeJeux) {
      newlive.jeux = safeJeux;
    }

    newlive.created_At = new Date();

    // Valider que l'ID utilisateur est sécurisé
    if (user._id) {
      const userId = user._id.toString();
      if (mongoose.Types.ObjectId.isValid(userId)) {
        newlive.creatorid = new mongoose.Types.ObjectId(userId);
      } else {
        return res.status(400).send({ error: 'ID utilisateur invalide' });
      }
    } else if (mongoose.Types.ObjectId.isValid(user.toString())) {
      newlive.creatorid = new mongoose.Types.ObjectId(user.toString());
    } else {
      return res.status(400).send({ error: 'ID utilisateur invalide' });
    }

    await newlive.save();

    return res.status(200).json({
      message: 'Stream created successfully',
      data: {
        _id: newlive._id,
        title: newlive.title,
        creatorid: newlive.creatorid
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Erreur lors de la création' });
  }
};

module.exports.livebyid_get = async (req, res) => {
  try {
    // Sécuriser l'ID
    const id = req.params.id.toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Format ID invalide' });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const liveStream = await Live.findById(objectId);

    if (!liveStream) {
      return res.status(404).send({ error: 'Live non trouvé' });
    }

    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: 'Erreur lors de la récupération' });
  }
};

module.exports.live_delete = async (req, res) => {
  try {
    // Récupérer et convertir l'ID en chaîne de caractères
    const id = req.params.id.toString();

    // Validation de l'ID
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return res.status(400).send({ error: 'ID invalide' });
    }

    // Validation pour ObjectId MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: 'Format ID invalide' });
    }

    // Convertir en ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Supprimer le live
    const live = await Live.findOneAndDelete({ _id: objectId });

    // Si le live n'existe pas
    if (!live) {
      return res.status(404).send({ error: 'Live non trouvé' });
    }

    // Supprimer les réclamations associées
    await Reclamation.deleteMany({ idlive: objectId });

    // Réponse
    res.status(200).send({
      success: true,
      message: 'Live et réclamations associées supprimés avec succès',
      data: { _id: live._id }
    });
  } catch (err) {
    console.error('Erreur dans live_delete:', err);
    res.status(500).send({
      error: 'Une erreur est survenue lors de la suppression'
    });
  }
};

module.exports.livecreated_get = async (req, res) => {
  try {
    // Sécuriser l'ID utilisateur
    const iduser = req.params.id.toString();

    // Validation pour ObjectId MongoDB
    if (!mongoose.Types.ObjectId.isValid(iduser)) {
      return res.status(400).send({ error: 'Format ID utilisateur invalide' });
    }

    const userObjectId = new mongoose.Types.ObjectId(iduser);

    const lives = await Live.find({ creatorid: userObjectId });

    return res.status(200).send(lives);
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: 'Erreur lors de la récupération' });
  }
};