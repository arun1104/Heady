'use strict';
let categoryHandler = require('./controllers/categories/expressHandler');
let productHandler = require('./controllers/products/expressHandler');
module.exports = {
  createCategory: categoryHandler.createCategoryRequesthandler,
  getCategory: categoryHandler.getCategoryhandler,
  createProduct: productHandler.createProductRequesthandler,
  updateProduct: productHandler.updateProducthandler,
  getProducts: productHandler.getProductsRequesthandler,
};
