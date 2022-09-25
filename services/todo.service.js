require("dotenv").config();
const Todo = require("../database/models/todo");

const createTodo = async (todoBody) => {
  return Todo.create(todoBody);
};

const getTodos = async () => {
  return Todo.find({});
};

const updateTodo = async (user, todoBody) => {
  return Todo.updateOne(user, todoBody, {
    new: true,
  });
};

const getTodosByFilter = async (filter, value) => {
  query = {};
  query[filter] = value;
  console.log(query);
  return Todo.find({ "$filter": new ObjectID(value) });
};

const getSelfTodos = async (user) => {
  return Todo.find({ username: user });
};

const deleteTodo = async (username, _id) => {
  return Todo.remove({ username, _id });
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  getTodosByFilter,
  getSelfTodos,
  deleteTodo,
};
