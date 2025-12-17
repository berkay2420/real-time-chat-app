const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  verifyRoomEntrance
} = require("../controllers/roomController");

router.post("/create", createRoom);
router.get("/", getRooms);
router.post("/verify", verifyRoomEntrance);

module.exports = router;
