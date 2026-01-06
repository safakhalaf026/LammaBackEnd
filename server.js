const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('morgan')

// Middleware
const isSignedIn = require('./middleware/isSignedIn')

// Controllers (all using express.Router())
const authCtrl = require('./controllers/auth') 
const serviceCtrl = require('./controllers/service')
const reviewCtrl = require('./controllers/review')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// General middleware
app.use(cors())
app.use(express.json())
app.use(logger('dev'))

// ---------- PUBLIC ROUTES ----------
app.use('/auth', authCtrl) 

// ---------- PROTECTED ROUTES ----------
app.use(isSignedIn)
app.use('/service', serviceCtrl)
app.use('/review', reviewCtrl)

// Test route
app.get('/test', (req, res) => {
  console.log(req.user)
  res.status(200).json({ message: 'You are logged in' })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}!`)
})
