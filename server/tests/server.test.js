const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /Todos', () => {
   it('should create a new todo', (done) => {
       let text= 'Kool is the man';

       request(app)
           .post('/todos')
           .send({text})
           .expect(200)
           .expect((res) => {
             expect(res.body.text).toBe(text)
           })
           .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
           });
   });

   it('should not create todo with invalid body data', (done) => {
       request(app)
           .post('/todos')
           .send({})
           .expect(400)
           .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
           });
   });
});

describe('GET /todos', () => {
   it('should get all todos', (done) => {
       request(app)
           .get('/todos')
           .expect(200)
           .expect((res) => {
                expect(res.body.todos.length).toBe(2);
           })
           .end(done);
   });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .expect(200)
           .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
           })
           .end(done)
    });

    it('should return 404 if not found', (done) => {
        let id = new ObjectID();

        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non object ids', (done) => {
        request(app)
            .get('/todos/123rgh')
            .expect(404)
            .end(done)
    });
});

describe('DELETE/todos/id', () => {
    it('should delete a todo', (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) =>{
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a 404 if todo not found', (done) => {
        let id = new ObjectID();

        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123rgh')
            .expect(404)
            .end(done)
    });
});

describe('Patch /todos/:id', () => {
    it('should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = 'jeah mon'


        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completed at if complete is false', (done) => {
        let id = todos[1]._id.toHexString();
        let text = 'keep it real';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });
});
