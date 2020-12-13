const Joi = require("joi");

function validateUserData(req, res, next) {
  const createUserRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = createUserRules.validate(req.body);

  if (error) {
    res.status(400).send({ message: "missed required fields" });
  }
  next();
}

module.exports = {
  validateUserData,
};
