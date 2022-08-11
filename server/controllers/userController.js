const User = require("../models/User")
const argon2 = require("argon2")
const db = require("../dbConnections")
const { ObjectID } = require("bson")

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
                    res.status(200).send({
                        username: user.username,
                    })
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
    getUserById,
    createUser,
    authenticateUser,
    updateUser,
    updatePassword,
    deleteUser
}
