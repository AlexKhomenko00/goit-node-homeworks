const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  subscription: {},
  token: {},
});

const Contact = mongoose.model("contact", contact);

module.exports = Contact;
