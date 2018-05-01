// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) throw error;
  console.log('Connected');

  const db = client.db('TodoApp');
  // db.collection('Todos').insertOne(
  //   {
  //     text: 'Another todo',
  //     completed: false
  //   },
  //   (error, result) => {
  //     if (error) throw error;
  //     console.log(JSON.stringify(result.ops, 0, 2));
  //   }
  // );

  // db.collection('Users').insertOne(
  //   {
  //     name: 'Mitch Hankins',
  //     age: 25
  //   },
  //   (error, result) => {
  //     if (error) throw error;
  //     console.log(result.ops[0]._id.getTimestamp());
  //   }
  // );

  client.close();
});
