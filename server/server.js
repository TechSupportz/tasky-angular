const express = require("express")
const cors = require("cors")
const client = require("./dbConnections")
const MongoClient = require("mongodb").MongoClient
require("dotenv").config()

const uri = process.env.MONGODB_CONNECTION_STRING

const app = express()

app.use(cors())
app.use(express.json())
// const router = express.Router()

app.route("/users").get((req, res) => {
	client
		.db("TaskyDB")
		.collection("users")
		.findOne({ username: "Steven" })
		.then((result) => {
			res.send(result)
		})
})

const port = 3001
app.listen(port, () => console.log(`Web server running @ http://localhost:${port}`))
