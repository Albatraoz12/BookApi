const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  createBook,
  getBooks,
  getBook,
  deleteBook,
} = require('../Controller/bookController');
const { authorization } = require('../Middleware/middleware');

const router = express.Router();

// Create the uploads directory if it doesn't exist
const uploadDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalNameWithoutExtension = file.originalname.split('.')[0];
    cb(
      null,
      originalNameWithoutExtension +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
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

// Route to delete Book
router.delete('/deleteBook/:id', authorization, deleteBook);

module.exports = router;
