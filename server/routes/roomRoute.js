const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  verifyRoomEntrance,
  getPublicRooms
} = require("../controllers/roomController");

router.post("/create", createRoom);
router.get("/", getRooms);
router.post("/verify", verifyRoomEntrance);
router.get("/public-rooms", getPublicRooms);

module.exports = router;
