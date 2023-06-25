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

// Update book
const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const validUser = await User.findOne({ _id: req.userId });

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    if (!validUser) {
      return res
        .status(404)
        .json({ error: 'You are not authorized or logged in' });
    }
    const bookFound = await Book.findOne({ _id: bookId });

    if (!bookFound) return res.status(404).json({ message: 'Book not found' });
    if (req.userId !== bookFound.owner.toString())
      return res
        .status(400)
        .json({ message: 'You are not allowed to update this book' });

    const { title, description } = req.body;
    const imageName = req.file ? req.file.filename : bookFound.imageName;

    const updateBookInfo = {
      title: title,
      description: description,
      imageName: imageName,
      owner: req.userId,
    };
    const options = { new: true };
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateBookInfo,
      options
    );

    res.status(200).json({
      message: 'The book has been updated',
      data: updatedBook,
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

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
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

module.exports = { createBook, getBooks, getBook, updateBook, deleteBook };
