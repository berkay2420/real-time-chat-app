const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getCurrentUser
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/me", getCurrentUser)

module.exports = router;
