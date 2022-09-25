require("dotenv").config();
const Todo = require("../database/models/todo");
const httpStatus = require("http-status");
const { catcher } = require("../utils");

const createTodo = (todoBody) => {
  return catcher.catcher(
    async (todoBody) => {
      const result = await Todo.create(todoBody);
      return { status: httpStatus.OK, result };
    },
    todoBody,
    "Error creating Todo"
  );
};

const getTodos = () => {
  return catcher.catcher(async () => {
    const result = await Todo.find({});
    return { status: httpStatus.OK, result };
  }, "Error creating Todo");
};

const updateTodo = (params) => {
  return catcher.catcher(
    async (params) => {
      const todo = await Todo.findOneAndUpdate(
        { username: params.user, _id: params.id },
        params.todoBody,
        {
          new: true,
          useFindAndModify: false,
        }
      );
      return { status: httpStatus.OK, result: todo};
    },
    params,
    "Error updating Todo"
  );
};

const getTodosByFilter = (params) => {
  return catcher.catcher(
    async (params) => {
      const query = {};
      query[params.filter] = params.value;
      const result = await Todo.find(query);
      return { status: httpStatus.OK, result };
    },
    params,
    "Error fetching Todos"
  );
};

const getSelfTodos = (params) => {
  return catcher.catcher(
    async (params) => {
      const result = await Todo.find({ username: params.user });
      return { status: httpStatus.OK, result };
    },
    params,
    "Error fetching Todos"
  );
};

const deleteTodo = (params) => {
  return catcher.catcher(
    async () => {
      const result = await Todo.findOneAndDelete({
        username: params.username,
        _id: params.id,
      });
      if (!result) {
        return {
          status: httpStatus.BAD_REQUEST,
          error: "Error deleting Todo",
        };
      }
      return { status: httpStatus.OK, result };
    },
    params,
    "Error deleting Todo"
  );
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  getTodosByFilter,
  getSelfTodos,
  deleteTodo,
};
