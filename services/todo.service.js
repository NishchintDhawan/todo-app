require("dotenv").config();
const Todo = require("../database/models/todo");

const createTodo = async (todoBody) => {
  try {
    return Todo.create(todoBody);
  } catch (error) {
    return false;
  }
};

const getTodos = async () => {
  return Todo.find({});
};

const updateTodo = async (user, id, todoBody) => {
  const todo = await Todo.findOneAndUpdate(
    { username: user, _id: id },
    todoBody,
    {
      new: true,
      useFindAndModify: false,
    }
  );
  return todo;
};

const getTodosByFilter = async (filter, value) => {
  const query = {};
  query[filter] = value;
  try {
    return Todo.find(query);
  } catch (error) {
    return false;
  }
};

const getSelfTodos = async (user) => {
  try {
    return Todo.find({ username: user });
  } catch (error) {
    return false;
  }
};

const deleteTodo = async (username, _id) => {
  return Todo.findOneAndDelete({ username, _id });
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  getTodosByFilter,
  getSelfTodos,
  deleteTodo,
};
