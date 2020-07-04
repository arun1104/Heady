'use strict';
const dbLayer = require('../../utilities/mongodbLayer');
const Logger = require('../../utilities/logger');
const constants = require('../../utilities/constants');

class Category {
  constructor() {
    this.dbLayer = dbLayer;
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.getChildren = this.getChildren.bind(this);
  }

  async getChildren(_id, correlationId) {
    const logger = new Logger(correlationId, 'getCategory-Category', 'getCategory');
    logger.info('Entry', _id);
    try {
      if (_id){
        let options = {query: { _id}};
        options.correlationId = correlationId;
        let docs = await this.dbLayer.getChildren(options, correlationId, constants['CATEGORY_COLLECTION']);
        logger.info('Exit');
        return docs;
      } else {
        let docs = await this.dbLayer.getAll(correlationId, constants['CATEGORY_COLLECTION']);
        logger.info('Exit');
        return docs;
      }
    } catch (err) {
      logger.error(err);
      if (!err.status){
        let error = new Error('Internal server error');
        error.status = 500;
        throw error;
      } else throw err;
    }
  }

  async createCategory(body, correlationId) {
    const logger = new Logger(correlationId, 'createCategory-Category', 'createCategory');
    logger.info('Entry');
    try {
      let category = await this.dbLayer.insertMany({ data: body }, correlationId, constants['CATEGORY_COLLECTION']);
      logger.info('Exit');
      return category;
    } catch (err) {
      logger.error(err);
      if (!err.status){
        let error = new Error('Internal server error');
        error.status = 500;
        throw error;
      } else throw err;
    }
  }

  async updateCategory(req, res) {
    let query = req.query;
    let data = req.body;
    let correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'updateEmployee-Employees', 'updateEmployee');
    logger.info('Entry');
    try {
      let doc = await this.dbLayer.updateDoc({ query, data }, correlationId, constants['CATEGORY_COLLECTION']);
      if (doc != null) {
        logger.info('Exit');
        res.status(200).send(doc);
      } else {
        res.status(400).send({ message: 'Bad request' });
      }
    } catch (err) {
      logger.error(err);
      res.status(500).send({ message: 'Internal server error' });
    }
  }

  async getCategory(categoryId, correlationId) {
    const logger = new Logger(correlationId, 'getCategory-Category', 'getCategory');
    logger.info('Entry', categoryId);
    try {
      let options = {query: { categoryId}, index: 0, count: 1};
      options.correlationId = correlationId;
      let docs = await this.dbLayer.getDocs(options, correlationId, constants['SURVEY_COLLECTION']);
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

module.exports = new Category();
