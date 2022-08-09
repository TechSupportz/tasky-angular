const User = require("../models/User")
const UserDB = require("../models/UserDB")
const argon2 = require("argon2")
const userDB = new UserDB()
const db = require("../dbConnections")

function getUserById(req, res) {
    const userId = req.params.id

    db.collection("users").findOne(
        { _id: new ObjectID(userId) },
        (err, user) => {
            if (err) {
                res.status(500).send(err)
            } else if (user === null) {
                res.status(404).send("User not found")
            } else {
                res.status(200).send(user)
            }
        },
    )
}

async function checkIfUserExists(username, email) {
    try {
        const user = await db
            .collection("users")
            .findOne({ $or: [{ username: username }, { email: email }] })
        if (user) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}

async function createUser(req, res) {
    const isExistingUser = await checkIfUserExists(
        req.body.username,
        req.body.email,
    )

    if (isExistingUser) {
        res.status(400).send("User already exists")
    } else {
        try {
            const hash = await argon2.hash(req.body.password)

            const user = new User(
                null,
                req.body.username,
                req.body.email,
                hash,
                req.body.type,
            )

            db.collection("users").insertOne(
                {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    type: user.type,
                },
                (err, newUser) => {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        res.status(201).send({
                            _id: newUser.insertedId,
                            username: user.username,
                            email: user.email,
                            type: user.type,
                        })
                    }
                },
            )
        } catch (err) {
            res.status(500).send(err)
        }
    }
}

module.exports = {
    getUserById,
    createUser,
}
