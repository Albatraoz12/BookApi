const User = require('../Model/User');
const Book = require('../Model/Book');
const mongoose = require('mongoose');

// Get all books
const getBooks = async (req, res) => {
  try {
    const getAllBooks = await Book.find();
    res.status(200).json({ data: getAllBooks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while retrieving books' });
  }
};

// Get book by id
const getBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const getBookId = await Book.findById(bookId).populate({
      path: 'owner',
      select: 'name email username',
    });

    if (!getBookId) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (
      getBookId.image &&
      getBookId.image.data &&
      getBookId.image.contentType
    ) {
      res.contentType(getBookId.image.contentType);
      res.status(200).json(getBookId.image.data);
    } else {
      res.status(200).json({ data: getBookId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while retrieving book' });
  }
};

// Create a book
const createBook = async (req, res) => {
  try {
    const validUser = await User.findOne({ _id: req.userId });

    if (!validUser) {
      return res
        .status(404)
        .json({ error: 'You are not authorized or logged in' });
    }

    const { title, description } = req.body;
    const imagePath = req.file.path;
    const imageName = req.file.filename;

    const newBook = new Book({
      title: title,
      description: description,
      image: imagePath,
      imageName: imageName,
      owner: req.userId,
    });

    await newBook.save();

    res.status(200).json({
      message: 'Book has been created!',
      data: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while creating your book' });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.userId;

    if (!bookId) {
      return res.status(400).json({ error: 'Please provide a valid id' });
    }

    const book = await Book.findById(bookId).populate({
      path: 'owner',
      select: 'id',
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.owner.id !== userId) {
      return res
        .status(403)
        .json({ error: 'You are not the owner of this book' });
    }

    await book.deleteOne();

    res.status(200).json({ message: 'Your book has been deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while deleting book' });
  }
};

module.exports = { createBook, getBooks, getBook, deleteBook };
