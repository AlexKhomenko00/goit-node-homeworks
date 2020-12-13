const Joi = require("joi");

function validateAddContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string(),
    subscription: Joi.string(),
  });

  const { error } = createContactRules.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "missing required field" });
  }
  next();
}

function validateUpdateContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    password: Joi.string().optional(),
    token: Joi.string().optional(),
    subscription: Joi.string().optional(),
  }).min(1);

  const { error } = createContactRules.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "No field changed" });
  }
  next();
}

module.exports = {
  validateUpdateContact,
  validateAddContact,
};
