const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) throw error;
  console.log('Connected');

  const db = client.db('TodoApp');
  // Update Todo
  // db
  //   .collection('Todos')
  //   .findOneAndUpdate(
  //     {
  //       _id: new ObjectID('5ae8d695e3252292a073d5c2')
  //     },
  //     {
  //       $set: { completed: true }
  //     },
  //     { returnOriginal: false }
  //   )
  //   .then(console.log)
  //   .catch(console.log);

  // Update User
  // db
  //   .collection('Users')
  //   .findOneAndUpdate(
  //     {
  //       _id: new ObjectID('5ae8dd2ce3252292a073d5c3')
  //     },
  //     {
  //       $inc: { age: 1 },
  //       $set: { name: 'Mitch Hankins (updated)' },
  //     },
  //     { returnOriginal: false }
  //   )
  //   .then(console.log)
  //   .catch(console.log);
});
