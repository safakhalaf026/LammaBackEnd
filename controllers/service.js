const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['design', 'coding', 'writing', 'translation', 'other'],
    required: true
  },
  description: { type: String },
  pricing: {
    type: String,
    enum: ['exchange', 'free', 'fixed'],
    default: 'free'
  },
  amount: {
    type: Number,
    required: function () {
      return this.pricing === 'fixed';
    }
  },
  latitude: { type: String },
  longitude: { type: String },
  ratingStats: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
