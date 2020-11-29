"use strict";

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const contactsRouter = require("./api/contacts/contactsRouter");

require("dotenv").config();

const connection = mongoose.connect(process.env.DB_HOST, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

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
    connection
      .then(console.log("Database connection successful"))
      .then(() => {
        this.server.listen(process.env.PORT, () => {
          console.log("Server started lisnening opn port", process.env.PORT);
        });
      })
      .catch((err) => {
        console.log(`Server not running. Error message: ${err.message}`);
        process.exit(1);
      });
  }
}

new UserServer().start();
