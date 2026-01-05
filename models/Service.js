const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  serviceName: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    enum: ['Maintenance', 'Education', 'Cooking', 'Tailoring', 'Programming', 'Other'],
    required: true,
  },

  description: {
    type: String,
  },

  pricing: {
    type: String,
    enum: ['Free', 'Fixed', 'Service Exchange'],
    required: true,
    default: 'Free',
  },

  amount: {
    type: Number, 
    required: function(){return this.pricing === 'Fixed'}, // amount is required ONLY if 'Fixed' pricing is chosen
    min: 0,
  },

  latitude: {
    type: String,
    required: true,
  },

  longitude: {
    type: String,
    required: true,
  },

  ratingStats:{
    average:{
        type: Number,
        min: 0,
        max: 5,
    },
    count:{
        type: Number,
        min: 0,
    },
  },
},
  { timestamps: true }
)

// then we register the model with mongoose
const Service = mongoose.model('Service', serviceSchema)

// export the model
module.exports = Service

