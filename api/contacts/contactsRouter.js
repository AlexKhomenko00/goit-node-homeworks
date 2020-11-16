const express = require("express");

const ContactsController = require("./contactsController");

const contactsRouter = express.Router();

contactsRouter.get("/", ContactsController.listContacts);

contactsRouter.get("/:contactId", ContactsController.getContactById);

contactsRouter.patch(
  "/:contactId",
  ContactsController.validateContact,
  ContactsController.updateContact
);

contactsRouter.post(
  "/",
  ContactsController.validateContact,
  ContactsController.addContact
);

contactsRouter.delete("/:contactId", ContactsController.removeContact);

module.exports = contactsRouter;
