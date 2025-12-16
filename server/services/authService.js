const bcrypt = require("bcrypt");

require('dotenv').config();

const User = require('../models/user');
const { signAuthToken, setAuthCookie, getAuthCookie, verifyAuthToken  } = require("../utils/authUtils");

const registerService = async (username, password, res) => {
  try {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = {
      userId: existingUser._id.toString(),
      username: existingUser.username,
    }

    const token = await signAuthToken(payload);
    setAuthCookie(res, token);

    return {
      id: newUser._id.toString(),
      username: newUser.username,
    };
  } catch (error) {
    throw error;
  }
};


const loginService = async (username, password, res) => {
  try {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      throw new Error("User Not Exists");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const payload = {
      userId: existingUser._id.toString(),
      username: existingUser.username,
    }

    const token = await signAuthToken(payload);
    setAuthCookie(res, token);

    return {
      id: existingUser._id.toString(),
      username: existingUser.username,
    };
  } catch (error) {
    throw error;
  }
};

const getCurrentUserService = async (req) => {
  try {
    const token = getAuthCookie(req);
    console.log("Token:", token);

    if (!token) {
      throw new Error("No auth token found");
    }

    const payload = await verifyAuthToken(token);
    console.log("Payload:", payload);


    const user = await User.findById(payload.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      username: user.username,
    };
  } catch (error) {
    console.log("Error:", error.message); 
    throw error;
  }
};

module.exports = {
  registerService,
  loginService,
  getCurrentUserService
};