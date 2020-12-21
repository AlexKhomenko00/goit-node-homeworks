const User = require("./userModel");
const userRouter = require("./userRouter");

const createUser = ({ email, password }) => User.create({ email, password });

const findUserByEmail = (email) => User.findOne({ email });

const findUserById = (id) => User.findById(id);

const findUserByVerificationToken = (verificationToken) =>
  User.findOne({ verificationToken });

const verifyEmail = (verificationToken) =>
  User.findOneAndUpdate(verificationToken, { verificationToken: null });

const createVerificationToken = (userId, verificationToken) => {
  return User.findByIdAndUpdate(
    userId,
    {
      verificationToken,
    },
    { new: true }
  );
};

const updateUserToken = (id, token) =>
  User.findByIdAndUpdate({ _id: id }, { token });

module.exports = {
  createUser,
  findUserByEmail,
  updateUserToken,
  findUserById,
  findUserByVerificationToken,
  createVerificationToken,
  verifyEmail,
};
