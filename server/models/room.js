const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomname: {
    type: String,
    required: true,
    unique: true  
  },
  entrancePassword: {
    type: String,
    required: true
  },
  creator: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);