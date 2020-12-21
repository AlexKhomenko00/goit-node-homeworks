"use strict";

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");

const service = require("./userServices");
const { UnauthorizedError } = require("../helpers/errorsConstructor");
const createUserMail = require("../helpers/verificationMail");
const createAvatar = require("../helpers/userAvatarGenerator");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class UserController {
  static costFactor = 4;

  static get signUp() {
    return this._signUp.bind(this);
  }

  static async _signUp(req, res, next) {
    try {
      const {
        body: { email, password },
      } = req;

      const hashedPassword = await bcrypt.hash(password, this.costFactor);
      const tmplAvatarName = await createAvatar(email);

      await fs.rename(
        `tmp/${tmplAvatarName}`,
        `public/images/${tmplAvatarName}`,
        (err) => {
          if (err) throw new Error(err);
        }
      );

      const verificationToken = uuidv4();

      const result = await service.createUser({
        email,
        password: hashedPassword,
        avatarURL: `http://localhost:${process.env.DB_PORT}/images/${tmplAvatarName}`,
        verificationToken,
      });

      this.sendVerificationMail(result, verificationToken);

      const user = {
        email: result.email,
        subscription: result.subscription,
        avatarURL: result.avatarURL,
      };

      res.status(201).json(user);
    } catch (e) {
      const {
        keyPattern: { email },
      } = e;

      email
        ? res.status(409).send({
            message: "Email in use",
          })
        : next(e);
    }
  }

  static async _signIn({ body: { email, password } }, res, next) {
    try {
      const user = await service.findUserByEmail(email);

      if (!user || user.verificationToken) {
        return res.status(401).send("Not authorized");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send("Not authorized");
      }

      const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      await service.updateUserToken(user.id, token);

      const updatedUser = {
        email: user.email,
        subscription: user.subscription,
      };

      return res.status(200).send({ token, user: updatedUser });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async _signOut(req, res, next) {
    try {
      const user = req.user;

      await service.updateUserToken(user.id, null);

      return res.status(204).send();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const user = await service.findUserById(req.user.id);

      return res
        .status(200)
        .send({ email: user.email, subscription: user.subscription });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      if (!authorizationHeader) {
        next(new UnauthorizedError("User not authorized"));
      }
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      const user = await service.findUserById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  static async verifyMail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const userToVerify = await service.findUserByVerificationToken(
        verificationToken
      );

      if (!userToVerify) {
        res.status(404).send("User not found");
      }

      await service.verifyEmail(verificationToken);

      res.status(200).send();
    } catch (e) {
      console.log(e);
      next();
    }
  }

  static async sendVerificationMail(user, verificationToken) {
    try {
      await service.createVerificationToken(user.id, verificationToken);

      await sgMail.send({
        to: `${user.email}`, // Change to your recipient
        from: "sasvsha@gmail.com", // Change to your verified sender
        subject: "Verify your email",
        text: "please verify your email, before we start",
        html: `<a href="http://localhost:${process.env.DB_PORT}/users/auth/verify/${verificationToken}"> Verify :) </a>`,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = UserController;
