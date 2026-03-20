const taskModel = require('../models/taskModel.js');

module.exports.list = (req, res) => {
    res.status(200).send(taskModel.list());
};

module.exports.find = (req, res) => {
    const { id } = req.params;
    const task = taskModel.find(Number(id));

    if (!task)
        return res.status(404).send({ message: `task not found with id: ${id}`, });

    res.status(200).send(task);
};

module.exports.create = (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).send({ message: 'Invalid Task' });
    }

    const _task = taskModel.create(task);
    res.status(201).send(_task);
};

module.exports.update = (req, res) => {
    const { isDone } = req.body;

    if (isDone === null) {
        return res.status(400).send({ message: 'Invalid Name' });
    }

    const { id } = req.params;
    const _new = taskModel.update(Number(id), isDone);

    if (!_new)
        return res.status(404).send({ message: `task not found with id: ${id}` })


    res.status(200).send(_new);
};

module.exports.delete = (req, res) => {
    const { id } = req.params;
    const _del = taskModel.destroy(Number(id));

    if (!_del) {
        return res.status(404).send({ message: `task not found with id: ${id}`, });
    }

    res.sendStatus(204);
};