const express = require('express')
const router = express.Router()
const Service = require('../models/Service')
const Review = require('../models/Review')

router.post('/:serviceId', async (req,res)=>{
    try {
        // retrieve service id and fetch it from database
        const {serviceId} = req.params
        const findService = await Service.findById(serviceId)

        // error handling
        if(!findService){
            return res.status(404).json({ err: 'Service Not found' })
        }

        // role validation
        const serviceOwner = String(findService.provider)
        if(serviceOwner === req.user._id){
            return res.status(403).json({ err: 'Service provider cant review their own service' })
        }

        // refrence logged in customer and found service
        const reviewData = {
            ...req.body,
            customer: req.user._id,
            service: serviceId,
        }

        // create record
        const review = await Review.create(reviewData)

        const allRatings = await Review.find({ service: serviceId }).select('rating') // returns an array that only has the ratings of that service
        const count = allRatings.length // finds the count based on the arrray length
        const sum = allRatings.reduce((acc, r) => acc + r.rating, 0) // reduce to loop through ratings array and find sum 
        const average = count === 0 ? 0 : Math.round((sum / count) * 10) / 10 // finally get average to one decimal point (checks if service has no ratings, then just return 0)

        // becuase fields are embedded, update and save from the service model 
        findService.ratingStats = { average, count }
        await findService.save()

        return res.status(201).json({review, ratingStats: findService.ratingStats})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: 'Failed to submit review' })
    }
})

router.get('/:serviceId', async (req,res)=>{
    try {
        // retrieve service id and fetch it from database
        const {serviceId} = req.params
        const findService = await Service.findById(serviceId)

        // error handling
        if(!findService){
            return res.status(404).json({ err: 'Service Not found' })
        }

        // retrieve all reviews where the id stored in the DB and the id from the browser is the same
        // .populate takes 2 arguments, the field we want to refrence and the data we need to display
        // .sort shows the most recent added review
        const allReviews= await Review.find({service: serviceId}).populate('customer', 'displayName username avatar role').sort({createdAt: -1})

        return res.status(200).json({allReviews})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: 'Failed to retrieve reviews' })  
    }
})
module.exports = router