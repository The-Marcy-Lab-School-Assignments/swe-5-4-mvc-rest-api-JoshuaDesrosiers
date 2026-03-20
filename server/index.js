const express = require('express');
const path = require('path');
const controller = require('./controllers/taskController.js')
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


app.get('/api/todos', controller.list)
app.post('/api/todos', controller.create)
app.get('/api/todos/:id', controller.find)
app.patch('/api/todos/:id', controller.update)
app.delete('/api/todos/:id', controller.delete)
const port = 8080;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
