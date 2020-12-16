"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const service = require("./userServices");
const { UnauthorizedError } = require("../helpers/errorsConstructor");
const createAvatar = require("../helpers/userAvatarGenerator");

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

      const result = await service.createUser({
        email,
        password: hashedPassword,
        avatarURL: `http://localhost:${process.env.DB_PORT}/images/${tmplAvatarName}`,
      });

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

      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send("Email or password is wrong");
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

  static async updateUserAvatar(req, res, next) {}
}

module.exports = UserController;
