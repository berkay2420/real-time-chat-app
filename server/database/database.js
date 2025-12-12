const mongoose = require("mongoose");

require('dotenv').config();

const DB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to the MongoDB Atlas");
  } catch (error) {
    console.error(`Error while connecting to the database `,error);
    process.exit(1);
  } 
}

module.exports = {connectDB};