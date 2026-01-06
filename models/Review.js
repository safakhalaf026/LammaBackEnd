<<<<<<< HEAD
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
=======
const mongoose = require('mongoose')

const reviewSchema  = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },

  rating: {
    type: Number, 
    required: true,
    min: 1,
    max: 5,
  },

  comment: {
    type: String,
  },

},
  { timestamps: true }
)

reviewSchema.index({ service: 1, customer: 1 }, { unique: true }) // this makes sure the same customer CANNOT review the same service twice

// then we register the model with mongoose
const Review = mongoose.model('Review', reviewSchema)

// export the model
module.exports = Review

>>>>>>> main
