const { ObjectID } = require('mongodb');

const Todo = require('../server/models/todo');
const User = require('../server/models/user');
const mongoose = require('../server/db/mongoose');

// Todo.remove({})
//   .then(result => console.log(result))
//   .catch(console.log);

Todo.findByIdAndRemove('5aefa65c7362170f2b638456')
  .then(todo => console.log(todo))
  .catch(console.log);
