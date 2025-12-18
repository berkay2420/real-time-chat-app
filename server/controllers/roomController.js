const {
  createRoomService,
  getRoomService,
  verifyRoomEntranceService
} = require("../services/roomService");

const createRoom = async (req, res) => {
  try {
    const { roomname, creator, entrancePassword } = req.body;

    await createRoomService(roomname, creator, entrancePassword);

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await getRoomService();
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json([]); 
  }
};

const verifyRoomEntrance = async (req, res) => {
  try {
    const { roomname, password } = req.body;

    await verifyRoomEntranceService(roomname, password);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  verifyRoomEntrance
};
