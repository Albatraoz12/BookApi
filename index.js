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

// Add connection to mongodb
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start the server on port 8080
const port = 8080;
app.listen(port, () => console.log(`Server is running on localhost:${port}`));
