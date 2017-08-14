'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Author Schema
 */
var AuthorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Author name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Author', AuthorSchema);
