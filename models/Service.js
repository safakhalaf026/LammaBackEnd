const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
