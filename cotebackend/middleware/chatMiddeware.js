const Chat = require('../models/chat');
const Tournament = require('../models/tournament');
const Live = require('../models/live');

// Function to save a message to the database
async function saveMessageToDatabase(room, message, sender) {
  try {
    const senderId = sender._id;
    console.log(room);
    const tour = await Tournament.findById(room);
    console.log("this is the tournament", tour);
    const live = await Live.findById(room);
    if (tour) {
      const chat = await Chat.findById(tour.chat);
      console.log("hello from here", chat);
      const newMessage = {
        message: message,
        idsender: senderId,
      };
      // await newMessage.save();
      await Chat.updateOne({ _id: tour.chat }, { $push: { messages: newMessage} });
    }
    if (live) {
      const chat = await Chat.findById(live.chat);
      const newMessage = {
        message: message,
        idsender: senderId,
      };
      // await newMessage.save();
      // await Chat.updateOne({ _id: live.chat }, { $addToSet: { messages: newMessage._id } });
      await Chat.updateOne({ _id: live.chat }, { $push: { messages: newMessage} });
    }
    return 'updated with success';
  } catch (error) {
    console.log(error);
    return { message: 'Internal server error' };
  }
}

module.exports = { saveMessageToDatabase };
