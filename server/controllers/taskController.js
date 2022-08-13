const Task = require("../models/Task")
const SubTask = require("../models/SubTask")
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

module.exports = {
    getTasksByUserId,
    getTasksByCategoryId,
    setTaskCompleteState,
    setSubTaskCompleteState,
}
