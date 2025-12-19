const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const anonUserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  role: {type: String, default: "user"}
});

module.exports = mongoose.model("AnonUser", anonUserSchema);