// Server file
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./Routes/UserRoute');
require('dotenv').config();

// initialize server
const app = express();

// Setup cors
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://jwtfrontend.onrender.com'],
  })
);
app.use(express.json()); // Enables to send json as response
app.use(cookieParser()); // Enables to set cookies to client

//Routes
app.use('/api', userRouter);

app.get('/', (req, res) => {
  const test = req.body;
  console.log(req.body);
  return res.status(200).json({ message: 'It Works!!!', yourMessage: test });
});

// Add connection to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Capture MongoDB connection event
const db = mongoose.connection;
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Capture MongoDB connection error event
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server on port 8080
const port = 8080;
app.listen(port, () => console.log(`Server is running on localhost:${port}`));
