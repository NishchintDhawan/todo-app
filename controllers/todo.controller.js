const Router = require("express"); // import Router from express
const { todoService } = require("../services");
const { auth } = require("./auth"); // import auth custom middlewares
const httpStatus = require("http-status");
const { check, validationResult } = require("express-validator");
const router = Router();
const filters = { 1: "category", 2: "username" };

// Todo Routes
// Get all Todos for all users, doesnt need to be auth.
router.get("/", async (req, res, next) => {
  const todos = await todoService.getTodos();

  if (todos.status >= httpStatus.BAD_REQUEST) {
    const err = {
      status: todos.status,
      message: todos.error,
    };
    next(err);
  } else {
    res.json(todos.result);
  }
});

router.get("/:category/:value", async (req, res, next) => {
  const filter = req.params.category;
  const value = req.params.value;

  if (Object.values(filters).includes(filter)) {
    const todos = await todoService.getTodosByFilter({ filter, value });

    if (todos.status >= httpStatus.BAD_REQUEST) {
      const err = {
        status: todos.status,
        message: todos.error,
      };
      return next(err);
    }
    res.json(todos.result);
  } else {
    const err = {
      status: httpStatus.BAD_REQUEST,
      message: "Invalid filter",
    };
    next(err);
  }
});

router.get("/self", auth, async (req, res, next) => {
  const { username } = req.user;
  const todos = await todoService.getSelfTodos(username);

  if (todos.status >= httpStatus.BAD_REQUEST) {
    const err = {
      status: todos.status,
      message: todos.error,
    };
    return next(err);
  }

  res.json(todos.result);
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
        message: "Missing parameters",
      };
      return next(err);
    }

    const { username } = req.user;
    req.body.username = username;

    const createTodo = await todoService.createTodo(req.body);

    if (createTodo.status >= httpStatus.BAD_REQUEST) {
      err = {
        status: createTodo.status,
        message: createTodo.error,
      };
      next(err);
    } else {
      res.status(httpStatus.CREATED).json(createTodo.result);
    }
  }
);

// Update a TODO, use PUT.
router.put("/:id", auth, async (req, res, next) => {
  const { username } = req.user;
  const _id = req.params.id;

  const updatedTodo = await todoService.updateTodo({
    user: username,
    id: _id,
    todoBody: req.body,
  });

  if (updatedTodo.status >= httpStatus.BAD_REQUEST) {
    err = {
      status: updatedTodo.status,
      message: updatedTodo.error,
    };
    next(err);
  } else {
    res.json(updatedTodo.result);
  }
});

// Delete a TODO use DELETE.
router.delete("/:id", auth, async (req, res, next) => {
  const { username } = req.user;
  const _id = req.params.id;

  const deleteTodo = await todoService.deleteTodo({ username, id: _id });

  if (deleteTodo.status >= httpStatus.BAD_REQUEST) {
    err = {
      status: deleteTodo.status,
      message: deleteTodo.error,
    };
    next(err);
  } else {
    res.status(deleteTodo.status).send();
  }
});

module.exports = router;
