const db = require("../dbConnections")
const { ObjectID } = require("bson")
const { default: axios } = require("axios")

function getCategoriesByUserId(req, res) {
    const userId = req.params.id

    db.collection("categories")
        .find({
            $or: [
                { creatorId: new ObjectID(userId) },
                { members: { $elemMatch: { userId: new ObjectID(userId) } } },
            ],
        })
        .toArray((err, categories) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(categories)
            }
        })
}

function getCategoryById(req, res) {
    const categoryId = req.params.id

    db.collection("categories").findOne(
        { _id: new ObjectID(categoryId) },
        (err, category) => {
            if (err) {
                res.status(500).send(err)
            } else if (category === null) {
                res.status(404).send("Category not found")
            } else {
                if (category.type === "GRP") {
                    res.status(200).send({
                        _id: category._id,
                        creatorId: category.creatorId,
                        name: category.name,
                        type: category.type,
                        boardId: category.boardId,
                        members: category.members,
                    })
                } else {
                    res.status(200).send({
                        _id: category._id,
                        creatorId: category.creatorId,
                        name: category.name,
                        type: category.type,
                    })
                }
            }
        },
    )
}

async function addCategory(req, res) {
    const categoryType = req.body.type
    try {
        if (categoryType === "GRP") {
            const boardRes = await axios
                .post("https://hq.pixelpaper.io/api/board", null, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.PIXELPAPER_API_KEY}`,
                    },
                })
              
            if(boardRes.status === 201) {
                var category = {
                    creatorId: new ObjectID(req.body.creatorId),
                    name: req.body.name,
                    type: categoryType,
                    boardId: boardRes.data.room_id,
                    members: [],
                }
            } else {
                res.status(500).send("Error creating pixel board")
            }
        } else {
            var category = {
                creatorId: new ObjectID(req.body.creatorId),
                name: req.body.name,
                type: categoryType,
            }
        }

        db.collection("categories").insertOne(category, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            } else {
                if (categoryType === "GRP") {
                    res.status(200).send({
                        _id: result.insertedId,
                        creatorId: category.creatorId,
                        name: category.name,
                        type: category.type,
                        boardId: category.boardId,
                        members: category.members,
                    })
                } else {
                    res.status(200).send({
                        _id: result.insertedId,
                        creatorId: category.creatorId,
                        name: category.name,
                        type: category.type,
                    })
                }
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

function updateCategory(req, res) {
    const categoryId = req.params.id
    const newName = req.body.name

    db.collection("categories").updateOne(
        { _id: new ObjectID(categoryId) },
        { $set: { name: newName } },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send({ name: newName })
            }
        },
    )
}

function addMemberToCategory(req, res) {
    const categoryId = req.params.id
    const userId = req.body.userId
    const username = req.body.username

    db.collection("categories").findOne(
        {
            $and: [
                {
                    $or: [
                        { creatorId: new ObjectID(userId) },
                        {
                            members: {
                                $elemMatch: { userId: new ObjectID(userId) },
                            },
                        },
                    ],
                },
                { type: "GRP" },
            ],
        },
        (err, category) => {
            if (err) {
                res.status(500).send(err)
            } else if (!category || category._id !== new ObjectID(categoryId)) {
                db.collection("categories").updateOne(
                    { _id: new ObjectID(categoryId) },
                    {
                        $push: {
                            members: {
                                userId: new ObjectID(userId),
                                username: username,
                            },
                        },
                    },
                    (err, result) => {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            res.status(200).send(result)
                        }
                    },
                )
            } else {
                res.status(409).send(
                    "User is already a member of this category",
                )
            }
        },
    )
}

function removeMemberFromCategory(req, res) {
    const categoryId = req.params.id
    const userId = req.params.userId

    db.collection("categories").updateOne(
        { _id: new ObjectID(categoryId) },
        { $pull: { members: { userId: new ObjectID(userId) } } },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

function deleteCategory(req, res) {
    const categoryId = req.params.id
    const boardId = req.body.boardId
    console.log(categoryId)

    db.collection("categories").deleteOne(
        { _id: new ObjectID(categoryId) },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                axios.delete(`https://hq.pixelpaper.io/api/board/${boardId}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.PIXELPAPER_API_KEY}`,
                    },
                })
                db.collection("tasks").deleteMany(
                    { categoryId: new ObjectID(categoryId) },
                    (err, result) => {
                        if (err) {
                            res.status(500).send(err)
                        } else {
                            res.status(200).send(result)
                        }
                    },
                )
            }
        },
    )
}

module.exports = {
    getCategoriesByUserId,
    getCategoryById,
    updateCategory,
    addCategory,
    addMemberToCategory,
    removeMemberFromCategory,
    deleteCategory,
}
