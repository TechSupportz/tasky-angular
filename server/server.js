const express = require("express")
const cors = require("cors")

const bookmarkController = require("./controllers/bookmarkController")
const categoryController = require("./controllers/categoryController")
const taskController = require("./controllers/taskController")
const userController = require("./controllers/userController")

const app = express()

app.use(cors())
app.use(express.json())

app.route("/user/register").post(userController.createUser)
app.route("/user/login").post(userController.authenticateUser)
app.route("/user/check").post(userController.checkIfUserExists)

app.route("/user/:id").get(userController.getUserById)
app.route("/user/:id/update").put(userController.updateUser)
app.route("/user/:id/update/password").put(userController.updatePassword)
app.route("/user/:id/delete").delete(userController.deleteUser)

app.route("/category/user/:id").get(categoryController.getCategoriesByUserId)
app.route("/category/:id").get(categoryController.getCategoryById)
app.route("/category/add").post(categoryController.addCategory)

const port = 3001
app.listen(port, () =>
    console.log(`Web server running @ http://localhost:${port}`),
)
