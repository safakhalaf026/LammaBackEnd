const express = require('express')
const router = express.Router()
const Service = require('../models/Service')
const Review = require('../models/Review')

router.post('/:serviceId', async (req,res)=>{
    try {
        const {serviceId} = req.params
        const findService = await Service.findById(serviceId)

        if(!findService){
            return res.status(404).json({ err: 'Service Not found' })
        }

        const serviceOwner = String(findService.provider)
        if(serviceOwner === req.user._id){
            return res.status(403).json({ err: 'Service provider cant review their own service' })
        }

        const reviewData = {
            ...req.body,
            customer: req.user._id,
            service: serviceId,
        }

        const review = await Review.create(reviewData)

        const reviews = await Review.find({ service: serviceId }).select('rating')
        const count = reviews.length
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
        const average = count === 0 ? 0 : Math.round((sum / count) * 10) / 10

        findService.ratingStats = { average, count }
        await findService.save()

        return res.status(201).json({review, ratingStats: findService.ratingStats})

    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: 'Failed to submit review' })
    }

})

module.exports = router