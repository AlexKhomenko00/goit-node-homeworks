const express = require("express");

const userRouter = express.Router();

const UserController = require("./userController");
const UserSchemas = require("../../validation/usersSchemas");

userRouter.post(
  "/auth/register",
  UserSchemas.validateUserData,
  UserController.signUp
);

userRouter.put(
  "/auth/login",
  UserSchemas.validateUserData,
  UserController._signIn
);

userRouter.patch(
  "/auth/logout",
  UserController.authorize,
  UserController._signOut
);

userRouter.get(
  "/current",
  UserController.authorize,
  UserController.getCurrentUser
);

module.exports = userRouter;
