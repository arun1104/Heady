'use strict';
const { productSchema, updateProductSchema } = require('./hapiSchemas/schemas');
const product = require('./products');
const Logger = require('../../utilities/logger');

class ExpressHandler {
  constructor() {
    this.product = product;
    this.createProductRequesthandler = this.createProductRequesthandler.bind(this);
    this.updateProducthandler = this.updateProducthandler.bind(this);
    this.getProductsRequesthandler = this.getProductsRequesthandler.bind(this);
  }

  async createProductRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'createProductRequesthandler-expressHandler', 'createProductRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await productSchema.validateAsync(req.body);
      let handlerRes = await this.product.createProduct(reqBody, correlationId);
      res.cookie('access_token', handlerRes.token, { maxAge: 360000 });
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }

  async updateProducthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'updateProducthandler-expressHandler', 'updateProducthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await updateProductSchema.validateAsync(req.body);
      let query = {prodId: reqBody.prodId};
      delete reqBody['prodId'];
      let handlerRes = await this.product.updateProduct(query, reqBody, correlationId);
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }

  async getProductsRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'getProductRequesthandler-expressHandler', 'getProductRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      let handlerRes = await this.product.getProductsByCategory(req.query.category, correlationId);
      res.set({ 'content-type': 'application/json' });
      res.status(200).send(handlerRes);
    } catch (err) {
      if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
      } else if (err.message) {
        res.status(400).send({ message: err.message }); // JOI validation error
      } else {
        res.status(500).send({ message: 'Unexpected error' });
      }
    }
  }
}

module.exports = new ExpressHandler();
