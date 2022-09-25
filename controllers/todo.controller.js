const Router = require("express"); // import Router from express
const { todoService } = require("../services");
const { auth } = require("./auth"); // import auth custom middlewares
const httpStatus = require("http-status");
const { check, validationResult } = require("express-validator");
const router = Router();
const filters = { 1: "category", 2: "username" };

// Todo Routes
// Get all Todos for all users, doesnt need to be auth.
router.get("/", async (req, res) => {
  //optional parameter of filter
  const todos = await todoService.getTodos();
  res.json(todos);
});

router.get("/:category/:value", async (req, res) => {
  const filter = req.params.category;
  const value = req.params.value;
  if (Object.values(filters).includes(filter)) {
    const todos = await todoService.getTodosByFilter(filter, value);
    res.json(todos);
  } else {
    res.status(httpStatus.BAD_REQUEST).json({ errors: "Invalid filter" });
  }
});

router.get("/self", auth, async (req, res) => {
  const { username } = req.user;
  const todos = await todoService.getSelfTodos(username);
  if (!todos) {
    const err = {
      status: httpStatus.BAD_REQUEST,
      message: "Error fetching Todos",
    };
    return next(err);
  }
  res.json(todos);
});

// // // Create a Todo. Get the user auth token from middleware
router.post(
  "/",
  auth,
  check("category").not().isEmpty(),
  check("isCompleted").not().isEmpty(),
  check("title").not().isEmpty(),
  check("description").not().isEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = {
        status: httpStatus.BAD_REQUEST,
        message: "Invalid parameters given",
      };
      return next(err);
    }

    const { username } = req.user;
    req.body.username = username;

    const createTodo = await todoService.createTodo(req.body);
    if (!createTodo) {
      err = {
        status: httpStatus.BAD_REQUEST,
        message: "Error creating Todo",
      };
      next(err);
    } else {
      res.status(httpStatus.CREATED).send();
    }
  }
);

// Update a TODO, use PUT.
router.put("/:id", auth, async (req, res, next) => {
  const { username } = req.user;
  const _id = req.params.id;

  const updatedTodo = await todoService.updateTodo(username, _id, req.body);

  if (!updatedTodo) {
    err = {
      status: httpStatus.BAD_REQUEST,
      message: "Error updating todo",
    };
    next(err);
  } else {
    res.json(updatedTodo);
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
