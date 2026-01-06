const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const Service = require('../models/Service')

// GET all reviews for a specific service
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('customer', 'displayName')

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
    return res.status(201).json({ review: newReview })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to create review' })
  }
})

module.exports = router
