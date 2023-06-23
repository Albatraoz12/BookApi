const express = require('express');
const {
  createBook,
  getBooks,
  getBook,
} = require('../Controller/bookController');
const { authorization } = require('../Middleware/middleware');

const router = express.Router();

// Route to create a new book
router.post('/createBook', authorization, createBook);

// Route to get all the books
router.get('/getBooks', getBooks);

// Route to get one book with an id
router.get('/getBook/:id', getBook);

module.exports = router;
