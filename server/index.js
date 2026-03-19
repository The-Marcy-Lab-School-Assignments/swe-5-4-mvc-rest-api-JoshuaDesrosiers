const express = require('express');
const path = require('path');

const app = express();
const pathToFrontend = path.join(__dirname, '../frontend');

////////////////////////
// Middleware
////////////////////////

const logRoutes = (req, res, next) => {
  const time = (new Date()).toLocaleString();
  console.log(`${req.method}: ${req.originalUrl} - ${time}`);
  next();
};

app.use(logRoutes);
app.use(express.static(pathToFrontend));
app.use(express.json());

////////////////////////
// In-Memory Database
////////////////////////


// Increments and returns a unique id each time it is called.
let id = 1;
const getId = () => id++;

// Seed data — do not remove
const todos = [
  { id: getId(), task: 'Buy groceries', isDone: false },
  { id: getId(), task: 'Walk the dog', isDone: true },
  { id: getId(), task: 'Read a book', isDone: false },
];

////////////////////////
// Endpoints
////////////////////////

// TODO: GET /api/todos
// Response: 200, array of all todos
const getTodos = (req, res, next) =>{
res.send(todos)
}

// TODO: GET /api/todos/:id
// Response: 200, single todo object
// Error: 404 if no todo with that id
const getTodo = (req, res, next) =>{
const {id} = req.params
const todo = todos.find((_)=>_.id==id)
res.send(todo)
}

// TODO: POST /api/todos
// Request body: { task }
// Response: 201, the newly created todo object
// Error: 400 if task is missing from the request body
const postTodo = (req, res, next) =>{
const {task} = req.body
const todo = {task,id:getId(),isDone:false}
todos.push(todo)
res.status(201).send(todo)
}

// TODO: PATCH /api/todos/:id
// Request body: { isDone }
// Response: 200, the updated todo object
// Error: 404 if no todo with that id
const patchTodo = (req, res, next) =>{
const {id} = req.params
const {isDone} = req.body
const todo = todos.findIndex((_)=>_.id==id)
if(!id)
  res.status(404).send({message:'no todo found with that id'})
todos[todo] = {...todos[todo],isDone}
res.status(200).send(todos[todo])
}

// TODO: DELETE /api/todos/:id
// Response: 204, no content
// Error: 404 if no todo with that id

const delTodo = (req, res, next) =>{
const { id } = req.params;
  const index = todos.findIndex((todo) => todo.id === Number(id));
  if (index < 0) return res.status(404).send({ message: `No todo with the id ${id}` });
  todos.splice(index, 1);
  res.sendStatus(204);
}
// TODO: Catch-all handler — send a 404 JSON error for unmatched /api routes,
// or serve index.html for all other routes (SPA fallback)

app.get('/api/todos',getTodos)
app.post('/api/todos',postTodo)
app.get('/api/todos/:id',getTodos)
app.patch('/api/todos/:id',patchTodo)
app.delete('/api/todos/:id',delTodo)
const port = 8080;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
