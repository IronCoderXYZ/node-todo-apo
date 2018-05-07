const express = require('express');
const { ObjectID } = require('mongodb');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

const checkId = id => ObjectID.isValid(id);

app
  .use(bodyParser.json())
  .get('/todos', (req, res) => {
    Todo.find()
      .then(todos => res.send({ todos }))
      .catch(error => res.status(400).send(error));
  })
  .get('/todos/:id', (req, res) => {
    if (!checkId(req.params.id)) return res.status(404).send();
    Todo.findById(req.params.id)
      .then(todo => {
        if (!todo) return res.status(404).send();
        res.send({ todo });
      })
      .catch(error => res.status(400).send(error));
  })
  .post('/todos', (req, res) => {
    new Todo({
      text: req.body.text
    })
      .save()
      .then(document => res.send(document))
      .catch(error => res.status(400).send(error));
  })
  .listen(port, () => console.log(`Listening on port: ${port}`));

module.exports = app;
