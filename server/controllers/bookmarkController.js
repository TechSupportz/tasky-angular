const db = require("../dbConnections")
const { ObjectID } = require("bson")

function getBookmarksByUserId(req, res) {
    const userId = req.params.id

    db.collection("bookmarks")
        .find({
            creatorId: new ObjectID(userId),
        })
        .toArray((err, bookmarks) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(bookmarks)
            }
        })
}

function addBookmark(req, res) {
    const userId = req.params.id

    const title = req.body.title
    const url = req.body.url

    db.collection("bookmarks").insertOne(
        {
            _id: new ObjectID(),
            userId: new ObjectID(userId),
            title: title,
            url: url,
        },
        (err, result) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(result)
            }
        },
    )
}

function deleteBookmark(req, res) {
    const bookmarkId = req.params.id

    db.collection("bookmarks").deleteOne(
        { _id: new ObjectID(bookmarkId) },
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
    getBookmarksByUserId,
    addBookmark,
    deleteBookmark,
}
