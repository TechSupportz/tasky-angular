const MongoClient = require("mongodb").MongoClient
require("dotenv").config()

const uri = process.env.MONGODB_CONNECTION_STRING

const client = new MongoClient(uri, { useNewUrlParser: true })

client.connect((err) => {
	if (err) throw err
	console.log("Connected to database")
})

module.exports = client
