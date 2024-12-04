// models/Todo.js
const mongoose = require('mongoose');

// Define Todo schema
const todoSchema = new mongoose.Schema({
    username: { type: String, required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

// Create and export Todo model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
