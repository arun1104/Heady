'use strict';
const Joi = require('@hapi/joi');

const productSchema = Joi.object({
  createdBy: Joi.string()
    .trim()
    .min(3)
    .max(30),
  categories: Joi.array().items(Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()),
  name: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .required(),
  price: Joi.number(),
  priceUnit: Joi.string()
    .trim()
    .min(1)
    .max(5),
  quantity: Joi.string()
    .trim()
    .min(1)
    .max(5),
});

const updateProductSchema = Joi.object({
  createdBy: Joi.string()
    .trim()
    .min(3)
    .max(30),
  categories: Joi.array().items(Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()),
  prodId: Joi.string()
    .trim()
    .min(1)
    .max(60)
    .required(),
  name: Joi.string()
    .trim()
    .min(1)
    .max(30),
  price: Joi.number(),
  priceUnit: Joi.string()
    .trim()
    .min(1)
    .max(5),
  quantity: Joi.string()
    .trim()
    .min(1)
    .max(5),
});

module.exports = { productSchema, updateProductSchema };
