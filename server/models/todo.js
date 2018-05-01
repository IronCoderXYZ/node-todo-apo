const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  text: {
    trim: true,
    minlength: 1,
    type: String,
    required: true
  },
  doneAt: {
    type: Number,
    default: null
  },
  isDone: {
    type: Boolean,
    default: false
  }
});

module.exports = Todo;
