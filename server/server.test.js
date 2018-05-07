const expect = require('expect');
const supertest = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('./server');
const Todo = require('./models/todo');

const initialTodos = [
  { _id: new ObjectID(), text: 'First Todo' },
  {
    _id: new ObjectID(),
    text: 'Second Todo',
    isDone: true,
    doneAt: 101
  }
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

describe('DELETE /todos/:id', () => {
  it('Should remove a todo with a valid id', done => {
    const hexId = initialTodos[1]._id.toHexString();

    supertest(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((error, response) => {
        if (error) return done(error);
        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it('Should return 404 if todo not found', done => {
    supertest(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 if object id is invalid', done => {
    supertest(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update a todo', done => {
    const newText = 'New Text';
    const hexId = initialTodos[0]._id.toHexString();

    supertest(app)
      .patch(`/todos/${hexId}`)
      .send({ text: newText, isDone: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.isDone).toBe(true);
        expect(res.body.todo.text).toBe(newText);
        expect(typeof res.body.todo.doneAt).toBe('number');
      })
      .end(done);
  });

  it('Should clear completedAt when isCompleted is false', done => {
    const newText = 'New Text 2';
    const hexId = initialTodos[1]._id.toHexString();

    supertest(app)
      .patch(`/todos/${hexId}`)
      .send({ text: newText, isDone: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.doneAt).toBe(null);
        expect(res.body.todo.isDone).toBe(false);
      })
      .end(done);
  });
});
