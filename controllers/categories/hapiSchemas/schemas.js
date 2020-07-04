'use strict';
const Joi = require('@hapi/joi');

const categorySchema = Joi.array().items(Joi.object({
  _id: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required(),
  parent: Joi.string().trim(),
  ancestors: Joi.array().items(Joi.string()),
  children: Joi.array().items(Joi.string().max(30)),
}));

module.exports = { categorySchema};
