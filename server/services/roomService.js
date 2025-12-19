const Room = require('../models/room');
const bcrypt = require("bcrypt");
const PublicRoom = require('../models/publicRoom')


require('dotenv').config();

const dummyHash = process.env.DUMMY_HASH;

const validateRoomname = (roomname) => {
  if (!roomname || typeof roomname !== 'string') {
    throw new Error("Invalid room name");
  }
  if (roomname.length < 3 || roomname.length > 50) {
    throw new Error("Invalid room name");
  }
  return roomname.trim();
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error("Invalid password");
  }
  if (password.length < 6 || password.length > 256) {
    throw new Error("Invalid password");
  }
  return password;
};


const createRoomService = async(roomname, creator, entrancePassword, res) => {
  try {

    const validRoomname = validateRoomname(roomname);
    const validPassword = validatePassword(entrancePassword);

    
    const existingRoom = await Room.findOne({ roomname: validRoomname });
    if (existingRoom) {
      throw new Error("Room name already exists");
    }

    const hashedPassword = await bcrypt.hash(validPassword, 10);

    const newRoom = new Room({
      roomname: validRoomname,
      entrancePassword: hashedPassword,
      creator
    });

    await newRoom.save();

  } catch (error) {

    throw error;
    
  }
}

const getRoomService = async () => {
  try {
    return await Room.find({})
      .select("roomname creator")  
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error(`error while fetching rooms ${error}`);
    throw error;
  }
};

const verifyRoomEntranceService = async (roomname, password) => {
  try {
    const validRoomname = validateRoomname(roomname);
    const validPassword = validatePassword(password);

    
    const room = await Room.findOne({ roomname: validRoomname });
    
    if (!room) {
      await bcrypt.compare(validPassword, dummyHash);
      throw new Error("Invalid room name or password");
    }

    
    const isMatch = await bcrypt.compare(validPassword, room.entrancePassword);
    if (!isMatch) {
      throw new Error("Invalid room name or password");
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};

const getPublicRoomsService = async () => {
  try {
    return await PublicRoom.find({})
      .select("roomname")  
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error(`error while fetching rooms ${error}`);
    throw error;
  }
}

module.exports = {
  createRoomService,
  getRoomService,
  verifyRoomEntranceService,
  getPublicRoomsService
};