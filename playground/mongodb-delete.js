const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) throw error;
  console.log('Connected');

  const db = client.db('TodoApp');
  // deleteMany
  // db
  //   .collection('Todos')
  //   .deleteMany({ text: 'Get Food' })
  //   .then(console.log)
  //   .catch(console.log);

  // deleteOne
  // db
  //   .collection('Todos')
  //   .deleteOne({ text: 'Walk the puppies' })
  //   .then(console.log)
  //   .catch(console.log);

  // findOneAndDelete
  // db
  //   .collection('Todos')
  //   .findOneAndDelete({ completed: true })
  //   .then(console.log)
  //   .catch(console.log);

  db
    .collection('Todos')
    .findOneAndDelete({ _id: ObjectID('5ae8d55ffde0528f687d257b') })
    .then(console.log);
});
