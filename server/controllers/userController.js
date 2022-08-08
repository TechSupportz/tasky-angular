const User = require("../models/User")
const UserDB = require("../models/UserDB")
const argon2 = require("argon2")

const userDB = new UserDB()

function getUserById(req, res) {
    const userId = req.params.id

    userDB.getUserById(userId, (err, user) => {
        if (err) {
            res.status(500).send(err)
        } else if (user === null) {
            res.status(404).send("User not found")
        } else {
            res.status(200).send(user)
        }
    })
}

async function createUser(req, res) {
    try {
        const hash = await argon2.hash(req.body.password)

        const user = new User(
            null,
            req.body.username,
            req.body.email,
            hash,
            req.body.type,
        )

        // console.log(user)

        userDB.createUser(user, (err, user) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(201).send(user)
            }
        })
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = {
    getUserById,
    createUser,
}
