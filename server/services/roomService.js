const Room = require('../models/room');
const bcrypt = require("bcrypt");


const createRoomService = async(roomname, creator, entrancePassword, res) => {
  try {
    if (!roomname || !entrancePassword) {
      throw new Error("You have to set roomname and password ");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRoom = new Room({
      roomname,
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
    throw error;
  }
};

const verifyRoomEntranceService = async (roomname, password) => {
  const room = await Room.findOne({ roomname });
  if (!room) {
    throw new Error("Room not found");
  }

  const isMatch = await bcrypt.compare(password, room.entrancePassword);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return { success: true };
};


module.exports = {
  createRoomService,
  getRoomService,
  verifyRoomEntranceService
};