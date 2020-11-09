const { promises: fsPromises } = require("fs");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function getContacts() {
  const data = await fsPromises.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(data);

  return contacts;
}

async function listContacts() {
  const contacts = await getContacts();

  console.table(contacts);
}

async function getContactById(contactId) {
  const contacts = await getContacts();

  const contactById = contacts.find((contact) => contact.id === contactId);

  console.log(contactById);
}

async function removeContact(contactId) {
  const contacts = await getContacts();

  updatedContacts = contacts.filter((contact) => contact.id !== contactId);

  await fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts));

  console.log("The contact was successfully removed!");
  listContacts();
}

async function addContact(name, email, phone) {
  const contacts = await getContacts();

  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));

  console.log("The contact was successfully added!");
  listContacts();
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
