const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const Todo = require('../../models/todo');
const User = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const initialUsers = [
  {
    _id: userOneId,
    password: 'password',
    email: 'user@email.com',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    password: 'password2',
    email: 'user2@email.com'
  }
];

const initialTodos = [
  { _id: new ObjectID(), text: 'First Todo' },
  {
    _id: new ObjectID(),
    text: 'Second Todo',
    isDone: true,
    doneAt: 101
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(initialUsers[0]).save();
      const userTwo = new User(initialUsers[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(initialTodos);
    })
    .then(() => done());
};

module.exports = { initialTodos, populateTodos, initialUsers, populateUsers };
