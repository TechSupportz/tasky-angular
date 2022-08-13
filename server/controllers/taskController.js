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

module.exports = {
	getTasksByUserId,
	getTasksByCategoryId,
}