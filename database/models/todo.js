const { Schema, model } = require("../connect"); // import Schema & model

// User Schema
const TodoSchema = new Schema({
  username: { type: String, required: true },
  category: { type: String, required: true },
  IsCompleted: { type: Boolean, required: true, default: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// User model
const Todo = model("Todo", TodoSchema);

module.exports = Todo;
