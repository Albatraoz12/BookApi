const User = require('../Model/User');
const Book = require('../Model/Book');
const mongoose = require('mongoose');

// Get all books
const getBooks = async (req, res) => {
  try {
    const getAllBooks = await Book.find();
    res.status(200).json({ Books: getAllBooks });
  } catch (error) {
    res.send(500).json({ error: error.message });
  }
};

// Get book by id
const getBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const getBookId = await Book.findById(bookId).populate({
      path: 'owner',
      select: 'name email username',
    });

    if (!getBookId) {
      return res.status(404).json({ message: 'There is no book with that ID' });
    }

    // Check if the book has an image
    if (
      getBookId.image &&
      getBookId.image.data &&
      getBookId.image.contentType
    ) {
      // Set the response content type based on the image's contentType
      res.contentType(getBookId.image.contentType);

      // Send the image data
      res.status(200).json(getBookId.image.data);
    } else {
      // If the book doesn't have an image, send the book details without the image data
      res.status(200).json({ book: getBookId });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a book
const createBook = async (req, res) => {
  try {
    const validUser = await User.findOne({ _id: req.userId });

    if (!validUser)
      return res
        .status(404)
        .json({ message: 'You are not authorized or logged in' });

    const { title, description } = req.body;
    const imagePath = req.file.path;
    const imageName = req.file.filename;
    console.log(`${title},${description},${imagePath},${imageName}`);
    const newBook = new Book({
      title: title,
      description: description,
      image: imagePath,
      imageName: imageName,
      owner: req.userId,
    });
    newBook.save();
    res.status(200).json({
      message: 'Book has been created! 😏 🍀',
      Book: newBook,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'error vile creating your book!' });
  }
};

module.exports = { createBook, getBooks, getBook };
