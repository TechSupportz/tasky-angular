const Category = require("../models/Category")
const db = require("../dbConnections")
const { ObjectID } = require("bson")

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

function addCategory(req, res) {
    const categoryType = req.body.type

    try {
        if (categoryType === "GRP") {
            var category = {
                creatorId: new ObjectID(req.body.creatorId),
                name: req.body.name,
                type: categoryType,
                members: [],
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

function deleteCategory(req, res) {
    const categoryId = req.params.id
    console.log(categoryId)

    db.collection("categories").deleteOne(
        { _id: new ObjectID(categoryId) },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

module.exports = {
    getCategoriesByUserId,
    getCategoryById,
    addCategory,
    deleteCategory,
}
