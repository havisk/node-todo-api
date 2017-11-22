const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../model/todo');
const {User} = require('./../../model/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email:'havisk@gmail.com',
    password:'testuser2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'kkcn').toString()
    }]
}, {
    _id: userTwoId,
    email: 'jeb@test.com',
    password: 'test2user'
}];



const todos = [{
    _id: new ObjectID(),
    text: 'First'
},{
    _id: new ObjectID(),
    text: 'second',
    competed: true,
    completedAt: 232
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};