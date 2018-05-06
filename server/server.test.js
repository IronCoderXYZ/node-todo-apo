const expect = require('expect');
const supertest = require('supertest');

const app = require('./server');
const Todo = require('./models/todo');

const initialTodos = [{ text: 'First Todo' }, { text: 'Second Todo' }];

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
