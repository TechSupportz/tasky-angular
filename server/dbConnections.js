const MongoClient = require("mongodb").MongoClient
require("dotenv").config()

const uri = process.env.MONGODB_CONNECTION_STRING

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect((err) => {
	if (err) throw err
	console.log("Connected to database")
})

const db = client.db("TaskyDB")

module.exports = db
