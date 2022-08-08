const { ObjectID } = require("bson")
const db = require("../dbConnections")
const User = require("./User")

class UserDB {
    getUserById(userID, callback) {
        db.collection("users").findOne({ _id: new ObjectID(userID) }, callback)
    }

    createUser(user, callback) {
        db.collection("users").insertOne(
            {
                username: user.username,
                email: user.email,
                password: user.password,
                type: user.type,
            },
            { unique: true },
            callback,
        )
    }
}

module.exports = UserDB
