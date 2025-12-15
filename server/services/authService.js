require('dotenv').config();
const bcrypt = require("bcrypt");

const User = require('../models/user');


const registerService = async (username, password) => {
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

    return {
      id: newUser._id,
      username: newUser.username,
    };
  } catch (error) {
    throw error;
  }
};


const loginService = async (username, password) => {
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

    return {
      id: existingUser._id,
      username: existingUser.username,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerService,
  loginService,
};
