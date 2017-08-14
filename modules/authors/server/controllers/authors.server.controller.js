'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Author = mongoose.model('Author'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Author
 */
exports.create = function(req, res) {
  var author = new Author(req.body);
  author.user = req.user;

  author.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(author);
    }
  });
};

/**
 * Show the current Author
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var author = req.author ? req.author.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  author.isCurrentUserOwner = req.user && author.user && author.user._id.toString() === req.user._id.toString();

  res.jsonp(author);
};

/**
 * Update a Author
 */
exports.update = function(req, res) {
  var author = req.author;

  author = _.extend(author, req.body);

  author.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(author);
    }
  });
};

/**
 * Delete an Author
 */
exports.delete = function(req, res) {
  var author = req.author;

  author.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(author);
    }
  });
};

/**
 * List of Authors
 */
exports.list = function(req, res) {
  Author.find().sort('-created').populate('user', 'displayName').exec(function(err, authors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authors);
    }
  });
};

/**
 * Author middleware
 */
exports.authorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Author is invalid'
    });
  }

  Author.findById(id).populate('user', 'displayName').exec(function (err, author) {
    if (err) {
      return next(err);
    } else if (!author) {
      return res.status(404).send({
        message: 'No Author with that identifier has been found'
      });
    }
    req.author = author;
    next();
  });
};
