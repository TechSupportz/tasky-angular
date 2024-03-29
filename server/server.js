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

app.route("/user/all").get(userController.getAllUsers)
app.route("/user/:id").get(userController.getUserById)
app.route("/user/:id/update").put(userController.updateUser)
app.route("/user/:id/update/password").put(userController.updatePassword)
app.route("/user/:id/delete").delete(userController.deleteUser)

app.route("/category/user/:id").get(categoryController.getCategoriesByUserId)
app.route("/category/:id").get(categoryController.getCategoryById)
app.route("/category/add").post(categoryController.addCategory)
app.route("/category/:id/addMember").put(categoryController.addMemberToCategory)
app.route("/category/:id/removeMember/:userId").delete(
    categoryController.removeMemberFromCategory,
)
app.route("/category/:id/update").put(categoryController.updateCategory)
app.route("/category/:id/delete").delete(categoryController.deleteCategory)

app.route("/task/user/:id").get(taskController.getTasksByUserId)
app.route("/task/category/:id").get(taskController.getTasksByCategoryId)
app.route("/task/:id/complete").put(taskController.setTaskCompleteState)
app.route("/task/:id/subTask/:subTaskId/complete").put(
    taskController.setSubTaskCompleteState,
)
app.route("/task/add").post(taskController.addTask)
app.route("/task/:id/subTask/add").post(taskController.addSubTask)
app.route("/task/:id/update").put(taskController.updateTask)
app.route("/task/:id/subTask/:subTaskId/update").put(
    taskController.updateSubTask,
)
app.route("/task/:id/delete").delete(taskController.deleteTask)
app.route("/task/:id/subTask/:subTaskId/delete").delete(
    taskController.deleteSubTask,
)

app.route("/bookmark/:id").get(bookmarkController.getBookmarksByUserId)
app.route("/bookmark/:id/add").post(bookmarkController.addBookmark)
app.route("/bookmark/:id/delete").delete(bookmarkController.deleteBookmark)

const port = 3001
app.listen(process.env.PORT || port, () =>
    console.log(`Web server running @ http://localhost:${port}`),
)
