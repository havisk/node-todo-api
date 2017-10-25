let express = require('express');
let bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./model/todo');
let { User } = require('./model/user');

let app = expree();

app.post('/todos', (req, res) => {

});




app.listen(3000, () => {
    console.log('started on port 3000')
});


