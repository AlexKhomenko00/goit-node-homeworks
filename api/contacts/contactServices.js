const Contact = require("./contactModel");

const getAllContacts = async () => {
  return Contact.find();
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const createContact = ({
  name,
  email,
  phone,
  password,
  subscription,
  token,
}) => {
  return Contact.create({ name, email, phone, password, subscription, token });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

module.exports = {
  removeContact,
  updateContact,
  createContact,
  getContactById,
  getAllContacts,
};
