// User model goes here
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    unique: true
  },
  passwordHashAndSalt: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;