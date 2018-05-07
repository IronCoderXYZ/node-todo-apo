const expect = require('expect');
const supertest = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('./server');
const Todo = require('./models/todo');

const initialTodos = [
  { _id: new ObjectID(), text: 'First Todo' },
  { _id: new ObjectID(), text: 'Second Todo' }
];

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(initialTodos);
    })
    .then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new todo', done => {
    const text = 'Test todo text';
    supertest(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(response => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) return done(error);
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(error => done(error));
      });
  });

  it('Should not create todo with invalid data', done => {
    supertest(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, response) => {
        if (error) return done(error);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(error => done(error));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', done => {
    supertest(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should get a todo with a valid id', done => {
    supertest(app)
      .get(`/todos/${initialTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(initialTodos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo not found', done => {
    supertest(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for invalid id', done => {
    supertest(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});
