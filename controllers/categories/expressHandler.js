'use strict';
const { categorySchema } = require('./hapiSchemas/schemas');
const category = require('./category');
const Logger = require('../../utilities/logger');

class ExpressHandler {
  constructor() {
    this.category = category;
    this.createCategoryRequesthandler = this.createCategoryRequesthandler.bind(this);
    //this.updateCategoryRequesthandler = this.updateCategoryRequesthandler.bind(this);
    this.getCategoryhandler = this.getCategoryhandler.bind(this);
  }

  async getCategoryhandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'getCategoryhandler-expressHandler', 'getCategoryhandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      let handlerRes = await this.category.getChildren(req.query.id, correlationId);
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

  async createCategoryRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'createCategoryRequesthandler-expressHandler', 'createCategoryRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await categorySchema.validateAsync(req.body);
      let handlerRes = await this.category.createCategory(reqBody, correlationId);
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

  async updateCategoryRequesthandler(req, res) {
    const correlationId = req.correlationId();
    const logger = new Logger(correlationId, 'updateCategoryRequesthandler-expressHandler', 'updateCategoryRequesthandler');
    logger.info('Entry');
    try {
      const correlationId = req.correlationId();
      const reqBody = await questionSchema.validateAsync(req.body);
      let categoryId = reqBody.categoryId;
      let createdBy = reqBody.createdBy;
      let data = reqBody.questions.map(element => {
        let {question, type, option, canBeSkipped} = element;
        return {
          categoryId, createdBy, question, type, option, canBeSkipped,
        };
      });
      let handlerRes = await this.category.addQuestions(data, correlationId);
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
