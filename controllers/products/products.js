'use strict';
const dbLayer = require('../../utilities/mongodbLayer');
const Logger = require('../../utilities/logger');
const constants = require('../../utilities/constants');
const { v4: uuidv4 } = require('uuid');

class Product {
  constructor() {
    this.dbLayer = dbLayer;
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.getProductsByCategory = this.getProductsByCategory.bind(this);
  }

  async createProduct(body, correlationId) {
    const logger = new Logger(correlationId, 'createProduct-Product', 'createProduct');
    logger.info('Entry');
    try {
      body.prodId = uuidv4();
      let product = await this.dbLayer.createDoc({ data: body }, correlationId, constants['PRODUCT_COLLECTION']);
      logger.info('Exit');
      return product;
    } catch (err) {
      logger.error(err);
      if (!err.status){
        let error = new Error('Internal server error');
        error.status = 500;
        throw error;
      } else throw err;
    }
  }

  async updateProduct(query, data, correlationId) {
    const logger = new Logger(correlationId, 'updateProduct-Products', 'updateProduct');
    logger.info('Entry');
    try {
      let doc = await this.dbLayer.updateDoc({ query, data }, correlationId, constants['PRODUCT_COLLECTION']);
      if (doc != null) {
        return doc;
      } else {
        let error = new Error('Bad request');
        error.status = 400;
        error.query = query;
        throw new Error({message: 'Unable to update the document'});
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async getProductsByCategory(category, correlationId) {
    const logger = new Logger(correlationId, 'getProductsByCategory-Product', 'getProductsByCategory');
    logger.info('Entry', category);
    try {
      let options = {query: { category}, index: 0, count: 30};
      options.correlationId = correlationId;
      let docs = await this.dbLayer.aggregateProductsByCategory(options, correlationId, constants['CATEGORY_COLLECTION'], constants['PRODUCT_COLLECTION']);
      logger.info('Exit');
      return docs;
    } catch (err) {
      logger.error(err);
      if (!err.status){
        let error = new Error('Internal server error');
        error.status = 500;
        throw error;
      } else throw err;
    }
  }
}

module.exports = new Product();
