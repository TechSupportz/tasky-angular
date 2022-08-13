const db = require("../dbConnections")
const { ObjectID } = require("bson")

function getTasksByUserId(req, res) {
    const userId = req.params.id

    db.collection("tasks")
        .find({
            creatorId: new ObjectID(userId),
        })
        .toArray((err, tasks) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(tasks)
            }
        })
}

function getTasksByCategoryId(req, res) {
    const categoryId = req.params.id

    db.collection("tasks")
        .find({
            categoryId: new ObjectID(categoryId),
        })
        .toArray((err, tasks) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(tasks)
            }
        })
}

function setTaskCompleteState(req, res) {
    const taskId = req.params.id
    const isCompleted = req.body.isCompleted

    db.collection("tasks").updateOne(
        { _id: new ObjectID(taskId) },
        { $set: { isCompleted: isCompleted } },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

function setSubTaskCompleteState(req, res) {
    const taskId = req.params.id
    const subTaskId = req.params.subTaskId
    const isCompleted = req.body.isCompleted

    if (isCompleted !== true && isCompleted !== false) {
        res.status(400).send("isCompleted must be a boolean")
        return
    }

    db.collection("tasks").updateOne(
        {
            _id: new ObjectID(taskId),
            subTask: { $elemMatch: { _id: new ObjectID(subTaskId) } },
        },
        { $set: { "subTask.$.isCompleted": isCompleted } },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

function addTask(req, res) {
    const categoryId = req.body.categoryId
    const creatorId = req.body.creatorId
    const name = req.body.name
    const dueDate = req.body.dueDate
    const priority = req.body.priority

    // console.table({ categoryId, creatorId, name, dueDate, priority })
    const taskId = new ObjectID()


    db.collection("tasks").insertOne(
        {
            _id: taskId,
            categoryId: new ObjectID(categoryId),
            creatorId: new ObjectID(creatorId),
            name: name,
            dueDate: new Date(dueDate),
            priority: priority,
            isCompleted: false,
            subTask: [],
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send({
                    _id: result.insertedId,
                    categoryId: new ObjectID(categoryId),
                    creatorId: new ObjectID(creatorId),
                    name: name,
                    dueDate: new Date(dueDate),
                    priority: priority,
                    isCompleted: false,
                    subTask: [],
                })
            }
        },
    )
}

function addSubTask(req, res) {
    const taskId = req.params.id
    const creatorId = req.body.creatorId
    const name = req.body.name
    const dueDate = req.body.dueDate
    const priority = req.body.priority

    const subTaskId = new ObjectID()

    db.collection("tasks").updateOne(
        { _id: new ObjectID(taskId) },
        {
            $push: {
                subTask: {
                    _id: subTaskId,
                    creatorId: new ObjectID(creatorId),
                    name: name,
                    dueDate: new Date(dueDate),
                    priority: priority,
                    isCompleted: false,
                },
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send({
                    _id: subTaskId,
                    creatorId: new ObjectID(creatorId),
                    name: name,
                    dueDate: new Date(dueDate),
                    priority: priority,
                    isCompleted: false,
                })
            }
        },
    )
}

function updateTask(req, res) {
    const taskId = req.params.id
    const name = req.body.name
    const dueDate = req.body.dueDate
    const priority = req.body.priority

    db.collection("tasks").updateOne(
        { _id: new ObjectID(taskId) },
        {
            $set: {
                name: name,
                dueDate: new Date(dueDate),
                priority: priority,
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send({
                    _id: taskId,
                    name: name,
                    dueDate: new Date(dueDate),
                    priority: priority,
                })
            }
        },
    )
}

function updateSubTask(req, res) {
    const taskId = req.params.id
    const subTaskId = req.params.subTaskId
    const name = req.body.name
    const dueDate = req.body.dueDate
    const priority = req.body.priority

    db.collection("tasks").updateOne(
        {
            _id: new ObjectID(taskId),
            subTask: { $elemMatch: { _id: new ObjectID(subTaskId) } },
        },
        {
            $set: {
                "subTask.$.name": name,
                "subTask.$.dueDate": new Date(dueDate),
                "subTask.$.priority": priority,
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send({
                    _id: subTaskId,
                    name: name,
                    dueDate: new Date(dueDate),
                    priority: priority,
                })
            }
        },
    )
}

function deleteTask(req, res) {
    const taskId = req.params.id

    db.collection("tasks").deleteOne(
        { _id: new ObjectID(taskId) },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

function deleteSubTask(req, res) {
    const taskId = req.params.id
    const subTaskId = req.params.subTaskId

    db.collection("tasks").updateOne(
        { _id: new ObjectID(taskId) },
        {
            $pull: {
                subTask: {
                    _id: new ObjectID(subTaskId),
                },
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

module.exports = {
    getTasksByUserId,
    getTasksByCategoryId,
    setTaskCompleteState,
    setSubTaskCompleteState,
    addTask,
    addSubTask,
    updateTask,
    updateSubTask,
    deleteTask,
    deleteSubTask,
}
