const User = require('../Model/User');
const Book = require('../Model/Book');

const createBook = async (req, res) => {
  try {
    const validUser = await User.findOne({ _id: req.userId });

    if (!validUser)
      return res
        .status(404)
        .json({ message: 'You are not authorized or logged in' });

    const { title, description, imagePath, imageName } = req.body;
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

module.exports = { createBook };
