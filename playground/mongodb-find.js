// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) throw error;
  console.log('Connected');

  const db = client.db('TodoApp');
  // db
  //   .collection('Todos')
  //   .find({ _id: new ObjectID('5ae8d184fde0528f687d2579'), completed: false })
  //   .toArray()
  //   .then(documents => {
  //     console.log(documents);
  //   })
  //   .catch(error => error);
  // db
  //   .collection('Todos')
  //   .find()
  //   .count()
  //   .then(count => {
  //     console.log(`Number of Todos: ${count}`);
  //   })
  //   .catch(error => error);
  db
    .collection('Users')
    .find({ name: 'Mitch Hankins' })
    .toArray()
    .then(documents => {
      console.log(documents);
    })
    .catch(error => error);

  client.close();
});
