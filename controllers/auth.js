const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')

router.post('/sign-up', async (req,res)=>{
    try {
        const { username, password} = req.body // destructure form entries
         // make sure the user does not exist
        const userInDatabase = await User.findOne({ username })
        if (userInDatabase) {
            return res.status(409).json({err:'Username or Password is invalid'})
        }
        // take the password and encrypt in some way.
        const hashPassword = bcrypt.hashSync(password, 10)

        // If the above passes, then let's create the account
        // with the encrypted password.
        req.body.password = hashPassword
        
        //create user
        const user = await User.create(req.body)

        // construct payload 
        const payload = {
            username: user.username,
            _id: user._id
        }

        // create token and attach payload to it
        const token = jwt.sign({payload}, process.env.JWT_SECRET)

        // when that succeeds let's go ahead and "sign the person in
        res.status(201).json({token})

    } catch (err) {
        console.log(err)
    }
})

router.post('/sign-in', async (req, res) => {
  try {
    // try to find the user in the db
    const { username, password } = req.body

    // make sure the user does not exist
    const userInDatabase = await User.findOne({ username })

    // if the user does not exist, redirect to sign up with msg
    if (!userInDatabase) {
      return res.status(401).json({err: err.message})
    }

    // if the user exists, lets compare the pw with the usr pw
    const isValidPassword = bcrypt.compareSync(password, userInDatabase.password)

    // if the pw doesnt match, throw an error
    if (!isValidPassword) {
      return res.status(401).json({err:'Username or Password is invalid'})
    }

    // else continue with the "login" 
    // Create payload
    const payload = { 
        username: userInDatabase.username,
        _id: userInDatabase._id 
    }
    // create token and attach payload to it
    const token = jwt.sign({payload}, process.env.JWT_SECRET)
    
    res.status(200).json({token})
  } catch (err) {
    console.error(err)
    res.status(500).json({err:'Username or Password is invalid'})
  }
})

module.exports=router