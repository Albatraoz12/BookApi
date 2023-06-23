const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  createBook,
  getBooks,
  getBook,
} = require('../Controller/bookController');
const { authorization } = require('../Middleware/middleware');

const router = express.Router();

// Create the uploads directory if it doesn't exist
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the destination folder for storing the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Add a unique suffix to the filename
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

// Create the multer upload middleware
const upload = multer({ storage: storage });

// Route to create a new book
router.post('/createBook', authorization, upload.single('image'), createBook);

// Route to get all the books
router.get('/getBooks', getBooks);

// Route to get one book with an id
router.get('/getBook/:id', getBook);

module.exports = router;
