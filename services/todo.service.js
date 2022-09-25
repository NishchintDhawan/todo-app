require("dotenv").config();
const Todo = require("../database/models/todo");
const httpStatus = require("http-status");

const createTodo = async (todoBody) => {
  try {
    const result = await Todo.create(todoBody);
    return { status: httpStatus.OK, result };
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: "Error creating Todo",
    };
  }
};

const getTodos = async () => {
  try {
    const result = await Todo.find({});
    return { status: httpStatus.OK, result };
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: "Error creating Todo",
    };
  }
};

const updateTodo = async (user, id, todoBody) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { username: user, _id: id },
      todoBody,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    return { status: httpStatus.OK, result: todo };
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: "Error updating Todo",
    };
  }
};

const getTodosByFilter = async (filter, value) => {
  const query = {};
  query[filter] = value;
  try {
    const result = await Todo.find(query);
    return { status: httpStatus.OK, result };
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching Todos",
    };
  }
};

const getSelfTodos = async (user) => {
  try {
    const result = await Todo.find({ username: user });
    return { status: httpStatus.OK, result };
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching Todos",
    };
  }
};

const deleteTodo = async (username, _id) => {
  try {
    const result = await Todo.findOneAndDelete({ username, _id });
    return { status: httpStatus.OK, result };
  } catch (error) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching Todos",
    };
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  getTodosByFilter,
  getSelfTodos,
  deleteTodo,
};
