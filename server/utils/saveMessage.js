const Message = require('../models/message');

async function saveMessage(message, username, room) {
  try {
    const newMessage = new Message({
      message,
      username,
      room,
    });
    
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw error;
  }
}

module.exports = saveMessage;