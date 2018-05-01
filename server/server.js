const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

const app = express();

app
  .use(bodyParser.json())
  .post('/todos', (req, res) => {
    new Todo({
      text: req.body.text
    })
      .save()
      .then(document => res.send(document))
      .catch(error => res.status(400).send(error));
  })
  .listen(process.env.PORT || 3000, () => {
    console.log('Running');
  });
