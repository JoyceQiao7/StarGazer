const mongoose = require('mongoose');

const starInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['star', 'galaxy', 'nebula', 'planet', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  basicFacts: {
    distance: String,
    size: String, 
    age: String,
    constellation: String
  },
  imageUrl: String,
  searchCount: {
    type: Number,
    default: 0
  },
  lastSearched: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
starInfoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const StarInfo = mongoose.model('StarInfo', starInfoSchema);

module.exports = StarInfo; 