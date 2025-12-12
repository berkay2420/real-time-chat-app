const Message = require('../models/message');

async function getMessages(room){
  try {

    const messages = await Message.find(
      {
        room:room
      }
    );
    
    return messages;

  } catch (error) {
    throw error;
  }
  
}

module.exports = getMessages;