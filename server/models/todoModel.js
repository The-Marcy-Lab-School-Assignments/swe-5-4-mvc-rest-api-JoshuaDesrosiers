let id = 1;
const getId = () => id++;

const todos = [
  { id: getId(), task: 'Buy groceries', isDone: false },
  { id: getId(), task: 'Walk the dog', isDone: true },
  { id: getId(), task: 'Read a book', isDone: false },
];

const list = () => todos.map(todo => ({ ...todo }));

const find = (id) => {
  const todo = todos.find(t => t.id === Number(id));
  return todo ? { ...todo } : null;
};

const create = (task) => {
  const todo = { id: getId(), task, isDone: false };
  todos.push(todo);
  return { ...todo };
};

const update = (id, changes) => {
  const todo = todos.find(t => t.id === Number(id));
  if (!todo) return null;
  Object.assign(todo, changes);
  return { ...todo };
};

const destroy = (id) => {
  const index = todos.findIndex(t => t.id === Number(id));
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
};

module.exports = { list, find, create, update, destroy };
