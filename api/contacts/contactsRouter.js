const express = require("express");

const ContactsController = require("./contactsController");
const ContactSchemas = require("../../validation/contactSchemas");

const contactsRouter = express.Router();

contactsRouter.get("/", ContactsController.listContacts);

contactsRouter.get("/:contactId", ContactsController.getContactById);

contactsRouter.patch(
  "/:contactId",
  ContactSchemas.validateUpdateContact,
  ContactsController.updateContact
);

contactsRouter.post(
  "/",
  ContactSchemas.validateAddContact,
  ContactsController.addContact
);

contactsRouter.delete("/:contactId", ContactsController.removeContact);

module.exports = contactsRouter;
