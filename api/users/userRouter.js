const express = require("express");
const multer = require("multer");
const path = require("path");

const userRouter = express.Router();

const UserController = require("./userController");
const UserSchemas = require("../../validation/usersSchemas");
const storage = require("../helpers/userAvatarStorage");

const upload = multer({ storage: storage });

userRouter.post(
  "/avatars",
  UserController.authorize,
  upload.single("avatar"),
  (req, res) =>
    res.status(200).send({
      avatarURL: `http://localhost:${process.env.DB_PORT}/images/${req.file.filename}`,
    })
);

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

// userRouter.get("/auth/verify/:verificationToken", UserController.verifyMail);

userRouter.get("/auth/verify/:verificationToken", UserController.verifyMail);

module.exports = userRouter;
