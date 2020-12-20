const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
  verificationToken: String,
});

const User = mongoose.model("user", user);

module.exports = User;
