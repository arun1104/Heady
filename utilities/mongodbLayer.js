'use strict';
const Logger = require('../utilities/logger');
const Mongoose = require('mongoose');
require('./mongooseSchemas');

class DBLayer {
  constructor() {
    this.Mongoose = Mongoose;
    this.createDoc = this.createDoc.bind(this);
    this.insertMany = this.insertMany.bind(this);
    this.updateDoc = this.updateDoc.bind(this);
    this.getChildren = this.getChildren.bind(this);
    this.getAll = this.getAll.bind(this);
    this.aggregateProductsByCategory = this.aggregateProductsByCategory.bind(this);
  }

  async aggregateProductsByCategory(options, correlationId, categoryCollection, productCollection) {
    const logger = new Logger(correlationId, 'aggregateProductsByCategory-DBLayer', 'aggregateProductsByCategory');
    logger.info('Entry');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let CategoryModel = this.Mongoose.model(categoryCollection);
      let children = await CategoryModel.find({ancestors: options.query.category}).lean();
      let totalCategories = [options.query.category];
      children.forEach(element => {
        totalCategories.push(element._id);
      });
      let ProductModel = this.Mongoose.model(productCollection);
      let products = await ProductModel.find({categories: { $in: totalCategories }}).lean();
      return products;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }

  }

  async getAll(correlationId, collection) {
    const logger = new Logger(correlationId, 'getAll-DBLayer', 'getAll');
    logger.info('Entry');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.Mongoose.model(collection);
      let children = await Model.find({}).populate('children').lean();
      return children;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }

  }

  async getChildren(params, correlationId, collection) {
    const logger = new Logger(correlationId, 'getChildren-DBLayer', 'getChildren');
    logger.info('Entry', params);
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.Mongoose.model(collection);
      let children = await Model.find(params.query).populate('children').lean();
      return children;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }

  }

  async getDocs(params, correlationId, collection) {
    const logger = new Logger(correlationId, 'getDocs', 'getDocs');
    logger.info('Entry', params);
    try {
      let options = params;
      options.correlationId = correlationId;
      options.collection = collection;
      let docs = await this.getMongoClientPromise(options);
      return docs;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }

  }

  async insertMany(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'createDoc-mongodbLayer', 'createDoc');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.Mongoose.model(modelName);
      let newDocs = await Model.insertMany(options.data, {new: true});
      let result = JSON.parse(JSON.stringify(newDocs));
      return result;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }
  }

  async createDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'createDoc-mongodbLayer', 'createDoc');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let Model = this.Mongoose.model(modelName);
      let newDoc = new Model(options.data);
      let result = JSON.parse(JSON.stringify(newDoc));
      await newDoc.save();
      return result;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }
  }

  async updateDoc(options, correlationId, modelName) {
    const logger = new Logger(correlationId, 'updateDoc-mongodbLayer', 'updateDoc');
    try {
      let connectionString = `${process.env.mongoUrl}/${process.env.dbName}`;
      logger.info('Connection string', connectionString);
      await this.Mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
      let model = this.Mongoose.model(modelName);
      let result = await model.findOneAndUpdate(options.query, options.data, { new: true });
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (err) {
      logger.error(err);
      let error = new Error('DB error');
      error.status = 500;
      throw error;
    }
  }
}

module.exports = new DBLayer();
