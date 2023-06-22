const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, max: 50 },
  password: { type: String, required: true, min: 5 },
  email: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', UserSchema);
