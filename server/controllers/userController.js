const User = require("../models/User")
const argon2 = require("argon2")
const db = require("../dbConnections")
const { ObjectID } = require("bson")

function getAllUsers(req, res) {
    db.collection("users")
        .find({})
        .project({
            _id: 1,
            username: 1,
            type: 1,
        })
        .toArray((err, users) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            } else {
                res.status(200).send(users)
            }
        })
}

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
                res.status(200).send({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    type: user.type,
                })
            }
        },
    )
}

// to check if user exists in the database FOR INTERNAL USE ONLY
async function _checkIfUserExists(username, email) {
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
        return true
    }
}

// to check if user exists in the database through the api
async function checkIfUserExists(req, res) {
    const username = req.body.username
    const email = req.body.email.toLowerCase()

    const isExistingUser = await _checkIfUserExists(username, email)

    if (isExistingUser) {
        res.status(409).send("User already exists")
    } else {
        res.status(200).send({})
    }
}

async function createUser(req, res) {
    const isExistingUser = await _checkIfUserExists(
        req.body.username,
        req.body.email,
    )

    if (isExistingUser) {
        res.status(409).send("User already exists")
    } else {
        try {
            const hash = await argon2.hash(req.body.password)

            const user = new User(
                null,
                req.body.username,
                req.body.email.toLowerCase(),
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

async function authenticateUser(req, res) {
    const username = req.body.username
    const password = req.body.password
    try {
        const user = await db
            .collection("users")
            .findOne({ username: username })
        if (user) {
            const isPasswordValid = await argon2.verify(user.password, password)
            if (isPasswordValid) {
                res.status(200).send({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    type: user.type,
                })
            } else {
                res.status(401).send("Invalid password")
            }
        } else {
            res.status(404).send("User not found")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

async function updateUser(req, res) {
    const userId = req.params.id
    const user = req.body
    try {
        const updatedUser = await db
            .collection("users")
            .findOneAndUpdate(
                { _id: new ObjectID(userId) },
                { $set: { ...user } },
                { returnOriginal: false },
            )
        if (updatedUser.value) {
            res.status(200).send({
                _id: updatedUser.value._id,
                username: updatedUser.value.username,
                email: updatedUser.value.email,
                type: updatedUser.value.type,
            })
        } else {
            res.status(404).send("User not found")
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

async function updatePassword(req, res) {
    const userId = req.params.id
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword

    try {
        const user = await db
            .collection("users")
            .findOne({ _id: new ObjectID(userId) })

        if (user) {
            const isPasswordValid = await argon2.verify(
                user.password,
                oldPassword,
            )
            if (isPasswordValid) {
                const hash = await argon2.hash(newPassword)
                const updatedUser = await db
                    .collection("users")
                    .findOneAndUpdate(
                        { _id: new ObjectID(userId) },
                        { $set: { password: hash } },
                        { returnOriginal: false },
                    )
                if (updatedUser.value) {
                    res.status(200).send({
                        newPassword: req.body.newPassword,
                    })
                } else {
                    res.status(404).send("User not found")
                }
            } else {
                res.status(401).send("Invalid password")
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

function deleteUser(req, res) {
    const userId = req.params.id

    try {
        db.collection("users").findOneAndDelete(
            { _id: new ObjectID(userId) },
            (err, user) => {
                if (user) {
                    // res.status(200).send({
                    //     username: user.username,
                    // })
                    db.collection("categories").deleteMany(
                        { creatorId: new ObjectID(userId) },
                        (err, result) => {
                            if (err) {
                                res.status(500).send(err)
                            } else {
                                db.collection("tasks").deleteMany(
                                    { creatorId: new ObjectID(userId) },
                                    (err, result) => {
                                        if (err) {
                                            res.status(500).send(err)
                                        } else {
                                            db.collection(
                                                "bookmarks",
                                            ).deleteMany(
                                                {
                                                    userId: new ObjectID(
                                                        userId,
                                                    ),
                                                },
                                                (err, result) => {
                                                    if (err) {
                                                        res.status(500).send(
                                                            err,
                                                        )
                                                    } else {
                                                        res.status(200).send({
                                                            username:
                                                                user.username,
                                                        })
                                                    }
                                                },
                                            )
                                        }
                                    },
                                )
                            }
                        },
                    )
                } else if (err) {
                    res.status(500).send(err)
                } else {
                    res.status(404).send("User not found")
                }
            },
        )
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    checkIfUserExists,
    createUser,
    authenticateUser,
    updateUser,
    updatePassword,
    deleteUser,
}
