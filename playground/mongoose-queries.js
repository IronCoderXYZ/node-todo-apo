const { ObjectID } = require('mongodb');

const Todo = require('../server/models/todo');
const User = require('../server/models/user');
const mongoose = require('../server/db/mongoose');

const todoId = '5aef96290576f30e8bdfea6c';

if (!ObjectID.isValid(todoId)) {
  return console.log('Invalid ID');
}

// Todo.find({ _id: todoId })
//   .then(todos => console.log('Todos:', todos))
//   .catch(console.log);

// Todo.findOne({ _id: todoId })
//   .then(todo => console.log('Todo:', todo))
//   .catch(console.log);

Todo.findById(todoId)
  .then(todo => {
    if (!todo) return console.log('No Todo Found');
    console.log(`Todo ID: ${todo}`);
  })
  .catch(console.log);

User.findById('5ae8edd4f3314698062432b1')
  .then(user => {
    if (!user) return console.log('No User Found');
    console.log(`User: ${user}`);
  })
  .catch(console.log);
