const Router = require("express"); // import Router from express
const { todoService } = require("../services");
const { auth } = require("./auth"); // import auth custom middlewares
const httpStatus = require("http-status");
const { check, validationResult } = require("express-validator");
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
  check("category", "Category is required").notEmpty(),
  check("isCompleted", "isCompleted status is required").notEmpty(),
  check("title", "Title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(httpStatus.BAD_REQUEST).json({ errors: errors.mapped() });
    }
    const { username } = req.user;
    req.body.username = username;

    const createTodo = await todoService.createTodo(req.body);
    if (createTodo.error) {
      res.status(httpStatus.BAD_REQUEST).json({ error: createTodo.error });
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
    res.status(httpStatus.BAD_REQUEST).json({ error: "Error updating todo" });
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
    res.status(httpStatus.BAD_REQUEST).json({ error: "Error deleting todo" });
  }
});

module.exports = router;
