const Joi = require("joi");
const service = require("./contactServices.js");

class ContactsController {
  static async listContacts(req, res) {
    try {
      const results = await service.getAllContacts();
      res.status(200).json(results);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async getContactById({ params: { contactId } }, res) {
    try {
      const contactById = await service.getContactById(contactId);
      return contactById
        ? res.status(200).json(contactById)
        : res.status(404).json({ message: "Not found" });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async removeContact({ params: { contactId } }, res, next) {
    try {
      const result = await service.removeContact(contactId);
      return result
        ? res.status(200).json(result)
        : res.status(404).json({ message: `Contact ${contactId} not found ` });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async updateContact(req, res, next) {
    const {
      body,
      params: { contactId },
    } = req;
    try {
      const result = await service.updateContact(contactId, body);
      res.status(201).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async addContact(req, res, next) {
    try {
      const result = await service.createContact(req.body);
      res.status(201).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

module.exports = ContactsController;
