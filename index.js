"use strict";

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("./api/helpers/userAvatarGenerator");

const contactsRouter = require("./api/contacts/contactsRouter");
const userRouter = require("./api/users/userRouter");

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
    this.server.use(
      cors({ origin: `http://localhost:${process.env.DB_PORT}` })
    );
  }

  initRoutes() {
    this.server.use("/contacts", contactsRouter);
    this.server.use("/users", userRouter);
    this.server.use(express.static("public/"));
  }

  startListening() {
    connection
      .then(console.log("Database connection successful"))
      .then(() => {
        this.server.listen(process.env.DB_PORT, () => {
          console.log("Server started lisnening on port", process.env.DB_PORT);
        });
      })
      .catch((err) => {
        console.log(`Server not running. Error message: ${err.message}`);
        process.exit(1);
      });
  }
}

new UserServer().start();
