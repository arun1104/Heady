'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  children: [{ type: String, trim: true }],
  ancestors: [{ type: String, trim: true }],
  _id: { type: String, trim: true},
  parent: { type: String, trim: true},
}, { strict: false, timestamps: true });

mongoose.model('category', categorySchema, 'category');

const productSchema = new Schema({
  createdBy: { type: String, lowercase: true, trim: true },
  name: { type: String, required: true },
  price: { type: Number },
  category: { type: String },
  prodId: { type: String, required: true },
}, { strict: false, timestamps: true });

productSchema.index({
  name: 1,
  prodId: 1,
}, {
  unique: true,
});

mongoose.model('products', productSchema, 'products');
