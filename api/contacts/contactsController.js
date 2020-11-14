const { promises: fsPromises } = require("fs");
const path = require("path");

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "../../db/contacts.json");

async function getContacts() {
  const data = await fsPromises.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(data);

  return contacts;
}

class ContactsController {
  static async listContacts(req, res) {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");

    return res.send(contacts);
  }

  static async getContactById({ params: { contactId } }, res) {
    const contacts = await getContacts();

    const contactById = contacts.find((contact) => contact.id === +contactId);

    return contactById
      ? res.status(200).json(contactById)
      : res.status(404).json({ message: "Not found" });
  }

  static async removeContact({ params: { contactId } }, res) {
    const contacts = await getContacts();

    const parsedId = Number.isNaN(+contactId) ? contactId : +contactId;

    const updatedContacts = contacts.filter((contact) => {
      return contact.id !== parsedId;
    });

    if (updatedContacts.length === contacts.length) {
      return res.status(404).json({ message: "Not found" });
    }

    await fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts));

    return res.status(200).json({ message: "Contact deleted" });
  }

  static async updateContact({ body, params: { contactId } }, res) {
    const contacts = await getContacts();

    const prevContact = contacts.find((contact) => contact.id === +contactId);

    if (!prevContact) {
      return res.status(404).json({ message: "Not found" });
    }

    const nextContact = {
      ...prevContact,
      ...body,
    };

    contacts.splice(contacts.indexOf(prevContact), 1, nextContact);

    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));

    return res.status(200).json(nextContact);
  }

  static async addContact(req, res) {
    const contacts = await getContacts();

    const newContact = {
      id: uuidv4(),
      ...req.body,
    };

    contacts.push(newContact);

    await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));

    return res.status(201).json(newContact);
  }

  static validateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const { error } = createContactRules.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing required field" });
    }
    next();
  }
}

module.exports = ContactsController;
