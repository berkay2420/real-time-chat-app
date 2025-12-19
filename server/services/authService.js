require('dotenv').config();

const bcrypt = require("bcrypt");

const User = require('../models/user');
const AnonUser = require('../models/anaonUser');

const { signAuthToken, setAuthCookie, getAuthCookie, verifyAuthToken  } = require("../utils/authUtils");

const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    throw new Error("Invalid username");
  }
  if (username.length < 3 || username.length > 50) {
    throw new Error("Invalid username");
  }
  return username.trim();
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

const dummyHash = process.env.DUMMY_HASH;



const registerService = async (username, password, res) => {
  try {

    const validUsername = validateUsername(username);
    const validPassword = validatePassword(password);


    const existingUser = await User.findOne({ 
      username: validUsername 
    });
    if (existingUser) {
      throw new Error("Invalid username or password");
    }


    const hashedPassword = await bcrypt.hash(validPassword, 10);

    const newUser = new User({
      username: validUsername,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = {
      userId: newUser._id.toHexString(),
      username: newUser.username,
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
    const validUsername = validateUsername(username);
    const validPassword = validatePassword(password);


    const existingUser = await User.findOne({ username: validUsername });
    if (!existingUser) {
      await bcrypt.compare(validPassword, dummyHash);
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(
      validPassword,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
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
    

    if (!token) {
      throw new Error("No auth token found");
    }

    const payload = await verifyAuthToken(token);

    let user = await User.findById(payload.userId);

    if (!user) {
      user = await AnonUser.findById(payload.userId);
    }

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      username: user.username,
    };

  } catch (error) {
    
    throw error;
  }
};

const createAnonUsername = async () => {
  let username;
  let existingUsername;

  do {
    const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    username = `anon-${randomNum.toString()}`;
    existingUsername = await AnonUser.findOne({ username });
  } while (existingUsername);
  
  return username;
};

const createAnonUserService = async (res) => {
  try {
    const username = await createAnonUsername();

    const newAnonUser = await AnonUser.create({
      username: username
    });

    await newAnonUser.save();

    const payload = {
      userId: newAnonUser._id.toHexString(),
      username: newAnonUser.username,
    }

    const token = await signAuthToken(payload);
    setAuthCookie(res, token);

    return {
      id: newAnonUser._id.toString(),
      username: newAnonUser.username,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  registerService,
  loginService,
  getCurrentUserService,
  createAnonUserService
};