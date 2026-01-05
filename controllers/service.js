const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const Service = require('../models/Service')

router.post('/', async (req, res) => {
    try {
        // role validation
        if(req.user.role !== 'Service Provider'){
            return res.status(403).json({ err: 'Only service providers can create services' })
        }

// --------- MUST ADD COORDINATES FROM FRONTEND IN THE FUTURE ------------ 
        // reference the logged in service provider 
        const serviceData = {
            ...req.body,
            provider: req.user._id,
        }

        // create record
        const service = await Service.create(serviceData)

        res.status(201).json({service})
    } catch (err) {
        console.error(err)
        res.status(500).json({ err: 'Failed to create service' })
    }
})

router.get('/', async (req, res) => {
    try {
        const services = await Service.find()
        res.status(200).json({services})
    } catch (err) {
        console.error(err)
        res.status(500).json({ err: 'Failed to get services data' })
    }
})

module.exports = router
