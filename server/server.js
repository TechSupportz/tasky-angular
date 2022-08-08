const express = require("express")
const cors = require("cors")

const bookmarkController = require("./controllers/bookmarkController")
const categoryController = require("./controllers/categoryController")
const taskController = require("./controllers/taskController")
const userController = require("./controllers/userController")


const app = express()

app.use(cors())
app.use(express.json())

app.route("/users/:id").get(userController.getUserById)
app.route("/users").post(userController.createUser)

const port = 3001
app.listen(port, () => console.log(`Web server running @ http://localhost:${port}`))
