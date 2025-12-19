const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicRoomSchema = new Schema({
  roomname: {
    type: String,
    required: true,
    unique: true  
  },
  creator: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PublicRoom', publicRoomSchema);