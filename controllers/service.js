const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')
const Service = require('../models/Service')

router.post('/', async (req, res) =>{
    try {
        const userId = req.user.
        
    } catch (err) {
        console.error(err)
        res.status(500).json({err:'Internal Server Error'})
    }
})

module.exports=router
