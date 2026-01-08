const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const Service = require('../models/Service')

// GET all reviews for a specific service
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('customer', 'displayName') // include displayName of the user

    return res.status(200).json({ reviews })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST a new review for a service
router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { service, rating, comment } = req.body

    // Check if service exists
    const findService = await Service.findById(service)
    if (!findService) {
      return res.status(404).json({ message: 'Service not found' })
    }

    // Create review
    const newReview = new Review({
      service,
      rating,
      comment,
      customer: req.user._id
    })

    await newReview.save()

    // Update ratingStats for the service
    const allReviews = await Review.find({ service })
    const total = allReviews.length
    const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / total

    await Service.findByIdAndUpdate(service, {
      ratingStats: {
        average,
        count: total
      }
    })

    // Populate customer field so frontend gets displayName immediately
    const populatedReview = await newReview.populate('customer', 'displayName')

    return res.status(201).json({ review: populatedReview })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to create review' })
  }
})

module.exports = router
