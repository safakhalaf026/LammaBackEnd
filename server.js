const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Middleware
const isSignedIn = require('./middleware/isSignedIn');

// Controllers
const authCtrl = require('./controllers/auth');       // authentication
const serviceCtrl = require('./controllers/service'); // services
const reviewCtrl = require('./controllers/review');   // reviews

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// General middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// ---------- PUBLIC ROUTES ----------
app.use('/auth', authCtrl); // sign-in / sign-up

// ---------- PROTECTED ROUTES ----------
app.use(isSignedIn);        // everything after this requires a valid JWT

// Register controllers (same style as instructor’s pets project)
serviceCtrl(app);           // GET /service/:id
reviewCtrl(app);            // GET /reviews/:id, POST /reviews

// Test route
app.get('/test', (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: 'You are logged in' });
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The express app is ready on port ${PORT}!`);
});
