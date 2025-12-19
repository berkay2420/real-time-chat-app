const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getCurrentUser,
  createAnonuser
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/me", getCurrentUser)
router.post("/new-anon", createAnonuser);


module.exports = router;
