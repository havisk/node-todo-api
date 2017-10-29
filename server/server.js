let express = require('express');
let bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./model/todo');
let { User } = require('./model/user');

let app = express();
const port = process.env.Port || 3000;

app.use(bodyParser.json());


app.post('/todos', (req, res) => {
    let todo = new Todo({
       text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({todos})
   }, (e) => {
       res.status(400).send(e);
   });
});

//Get by id
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo});
    }).catch((e) => {
       res.status(404).send();
    });
});



app.listen(process.env.Port || 3000, () => {
    console.log(`started on port ${port}`)
});

module.exports = {app};


