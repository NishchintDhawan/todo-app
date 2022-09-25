require("dotenv").config(); // load .env variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const { log } = require("mercedlogger"); // import mercedlogger's log function
const cors = require("cors"); // import cors
const UserRouter = require("./controllers/user.controller"); //import User Routes
const TodoRouter = require("./controllers/todo.controller"); // import Todo Routes

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors()); // add cors headers
app.use(morgan("tiny")); // log the request for debugging
app.use(express.json()); // parse json bodies
// add models to the express app

app.get("/", (req, res) => {
  res.send("this is the test route to make sure server is working");
});
app.use("/user", UserRouter); // send all "/user" requests to UserRouter for routing
app.use("/todos", TodoRouter); // send all "/todos" request to TodoROuter

app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`));
