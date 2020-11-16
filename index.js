"use strict";

const express = require("express");
const cors = require("cors");

const contactsRouter = require("./api/contacts/contactsRouter");

require("dotenv").config();

class UserServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started lisnening opn port", process.env.PORT);
    });
  }
}

new UserServer().start();
