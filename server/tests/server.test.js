const expect = require('expect');
const supertest = require('supertest');
const { ObjectID } = require('mongodb');

const app = require('../server');
const Todo = require('../models/todo');
const User = require('../models/user');
const {
  initialTodos,
  populateTodos,
  initialUsers,
  populateUsers
} = require('./seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET /users/me', () => {
  it('Should return user if authenticated', done => {
    supertest(app)
      .get('/users/me')
      // Set header
      .set('x-auth', initialUsers[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe(initialUsers[0].email);
        expect(res.body._id).toBe(initialUsers[0]._id.toString());
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', done => {
    supertest(app)
      .get('/users/me')
      .set('x-auth', 'This is an invalid token')
      .expect(401)
      .expect(res => expect(res.body).toEqual({}))
      .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user when valid info is supplied', done => {
    const email = 'unique.email@provider.com';
    const password = 'aNewUniquePasswordForUser';

    supertest(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end(error => {
        if (error) return done(error);
        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(error => done(error));
      });
  });

  it('Should return validation errors if user info is invalid', done => {
    const email = 'invalid.email'; // Invalid email
    const password = '123'; // Too short (req length of 4)

    supertest(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('Should not create user if email is in use', done => {
    const email = initialUsers[0].email; // Already in use through seeding
    const password = 'validPassword';

    supertest(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should login user and return auth token, expect removed toInclude', done => {
    const { email, password, _id } = initialUsers[1];
    supertest(app)
      .post('/users/login')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((error, res) => {
        if (error) return done(error);
        User.findById(_id)
          .then(user => {
            // expect(user.tokens[0]).toInclude({
            //   access: 'auth',
            //   token: res.headers['x-auth']
            // });
            done();
          })
          .catch(error => done(error));
      });
  });

  it('Should reject login with invalid credentials', done => {
    const { email, password, _id } = initialUsers[1];

    supertest(app)
      .post('/users/login')
      .send({ email, password: `${password} + invalid` })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((error, res) => {
        if (error) return done(error);
        User.findById(_id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(error => done(error));
      });
  });
});
