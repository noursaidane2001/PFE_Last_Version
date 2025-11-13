const Live = require('../models/live');
const { Livestream } = require('../middleware/livestream');
const { currentUser } = require('../middleware/currentUser');
const Reclamation = require('../models/reclamation');
const Chat = require('../models/chat');
module.exports.live_get = async (req, res) => {
  try {
    const liveStream = await Live.find().populate("creatorid");
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
module.exports.live_getnow = async (req, res) => {
  try {
    const liveStream = await Live.find({islive: true}).populate("creatorid");
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
module.exports.live_getpassed = async (req, res) => {
  try {
    const liveStream = await Live.find({islive: false}).populate("creatorid");
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
module.exports.live_update = async (req, res) => {
  try {
    const liveStream = await Live.findByIdAndUpdate(req.params.id, { islive: false });
    const chat = liveStream.chat;
    const chat0 = await Chat.findByIdAndUpdate(chat, { isOpen: false });
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

module.exports.live_post = async (req, res) => {
  try {
    const { title, youtubelink, jeux } = req.body;
    const user = currentUser(req.headers.authorization);
    console.log("this is the user", user);
    const newlive = new Live();

    if (youtubelink) {
      const vid = await Livestream(youtubelink);
      console.log(vid);
      if (vid.exists && vid.isLive) {
        newlive.youtubelink = youtubelink;
        const chat = new Chat({
          idlive: newlive._id,
        });
        await chat.save(); // Save the chat object to the database
        newlive.chat = chat._id;
      } else if (vid.exists && !vid.isLive) {
        console.log('The YouTube video is not live now');
        return res.status(400).json({ message: 'The YouTube video is not live now' });
      } else {
        console.log('The YouTube video link is invalid');
        return res.status(400).json({ message: 'The YouTube video link is invalid' });
      }
    }

    if (title) {
      newlive.title = title;
    }
    if (jeux) {
      newlive.jeux = jeux;
    }

    newlive.created_At = new Date();
    newlive.creatorid = user;
    await newlive.save();

    return res.status(200).json({ message: 'Stream created successfully', Live: newlive });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

module.exports.livebyid_get = async (req, res) => {
  try {
    const liveStream = await Live.findById(req.params.id);
    res.status(200).send(liveStream);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
module.exports.live_delete = async (req, res) => {
  try {
    id = req.params.id;
    live = await Live.findOneAndDelete({ _id: id });
    await Reclamation.deleteMany({ idlive: id });
    res.status(200).send(live)
  }
  catch (err) {
    res.status(400).send(err)
  }
};
module.exports.livecreated_get = async (req, res) => {
  try {
    iduser = req.params.id;
    const lives = await Live.find({ creatorid: iduser });

    return res.status(200).send(lives);
  } catch (err) {
    return res.status(400).send(err);
  }
};
