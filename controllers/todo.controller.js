const Router = require("express"); // import Router from express
const { todoService } = require("../services");
const { auth } = require("./auth"); // import auth custom middlewares
const httpStatus = require("http-status");
const { body, validationResult, check } = require("express-validator");
const router = Router();

// Todo Routes
// Get all Todos for all users, doesnt need to be auth.
router.get("/", async (req, res) => {
  //optional parameter of filter
  const todos = await todoService.getTodos();
  res.json(todos);
});

router.get("/:category/:value", async (req, res) => {
  const filter = req.params.id;
  const value = req.params.id;
  //verify value from ENUM -> user validators.
  const todos = await todoService.getTodosByFilter(filter, value);
  res.json(todos);
});

router.get("/self", auth, async (req, res) => {
  const { username } = req.user;
  const todos = await todoService.getSelfTodos(username);
  res.json(todos);
});

// // // Create a Todo. Get the user auth token from middleware
router.post(
  "/",
  auth,
  [
    check("category").not().isEmpty(),
    check("isCompleted").not().isEmpty(),
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      err = {
        status: httpStatus.BAD_REQUEST,
        message: "Missing parameters",
      };
      next(err);
    }
    const { username } = req.user;
    req.body.username = username;

    const createTodo = await todoService.createTodo(req.body);
    if (createTodo.error) {
      err = {
        status: httpStatus.BAD_REQUEST,
        message: createTodo.error,
      };
      next(err);
    }
    res.status(httpStatus.CREATED).send();
  }
);

// Update a TODO, use PUT.
router.put("/:id", auth, async (req, res) => {
  const { username } = req.user;
  const _id = req.params.id;
  try {
    const updatedTodo = await todoService.updateTodo(
      { username, _id },
      req.body
    );
    res.json(updatedTodo);
  } catch (error) {
    err = {
      status: httpStatus.BAD_REQUEST,
      message: "Error updating todo",
    };
    next(err);
  }
});

// Delete a TODO use DELETE.
router.delete("/:id", auth, async (req, res) => {
  const { username } = req.user;
  const _id = req.params.id;
  try {
    const deleteTodo = await todoService.deleteTodo(username, _id);
    res.json(deleteTodo);
  } catch (error) {
    err = {
      status: httpStatus.BAD_REQUEST,
      message: "Error deleting todo",
    };
    next(err);
  }
});

module.exports = router;
