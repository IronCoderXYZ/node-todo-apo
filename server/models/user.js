const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    trim: true,
    minlength: 1,
    type: String,
    required: true
  }
});

module.exports = User;
