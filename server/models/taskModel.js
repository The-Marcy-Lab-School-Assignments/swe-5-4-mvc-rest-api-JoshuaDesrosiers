let id = 1;
const getId = () => id++;

const todos = [
    { id: getId(), task: 'Buy groceries', isDone: false },
    { id: getId(), task: 'Walk the dog', isDone: true },
    { id: getId(), task: 'Read a book', isDone: false },
];

module.exports.list = () => {
    return [...todos];
};

module.exports.find = (id) => {
    const task = todos.find((t) => t.id === id);
    if (!task) return null;
    return task;
};

module.exports.create = (task) => {
    const _task = { task, id: getId() };
    todos.push(_task);
    return _task;
};

module.exports.update = (id, done) => {
    const task = todos.find((t) => t.id === id);
    if (!task) return null;
    task.isDone = done;
    return task;
};

module.exports.destroy = (id) => {
    const _in = todos.findIndex((t) => t.id === id);
    if (!(_in + 1)) return false;
    todos.splice(_in, 1);
    return true;
};