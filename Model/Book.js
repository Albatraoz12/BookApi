const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  imageName: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Book', BookSchema);
