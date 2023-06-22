// Server file
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// initialize server
const app = express();

// Add connection to mongodb
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start the server on port 8080
const port = 8080;
app.listen(port, () => console.log(`Server is running on localhost:${port}`));
