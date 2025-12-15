const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  role: {type: String, default: "user"}
});

module.exports = mongoose.model("User", userSchema);