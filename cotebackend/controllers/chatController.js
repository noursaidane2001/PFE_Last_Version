const Chat = require('../models/chat');

const Tournament = require('../models/tournament');
const User = require('../models/user');
const Live = require('../models/live');
module.exports.chat_getLive = async (req, res) => {
  try {
    const idlive = req.params.id;
    const livechat = await Live.findById(idlive);
    const chatid = livechat.chat;
    const chatlive = await Chat.findById(chatid).populate('messages.idsender');
    const messages = chatlive.messages;
    return res.send(messages);
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.chat_getTournamnent = async (req, res) => {
  try {
    const idtour = req.params.id;
    const tourchat = await Tournament.findById(idtour);
    const chatid = tourchat.chat;
    const tournachat = await Chat.findById(chatid).populate('messages.idsender');
    const messages = tournachat.messages;
    return res.send(messages);
  } catch (err) {
    return res.status(400).send(err);
  }
};
