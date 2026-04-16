// Todo routes - sab todo endpoints yahan hain

const express = require("express");
const { getTodos, addTodo, updateTodo, deleteTodo } = require("../controller/todo.controller");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

// sab routes protected hain - sirf logged in users access kar sakte hain
// verifyJWT middleware har request mein user ki identity check karta hai

// Get all todos for logged in user
router.get("/get-todos", verifyJWT, getTodos);

// Add new todo
router.post("/add-todo", verifyJWT, addTodo);

// Update existing todo
router.put("/update-todo/:todoId", verifyJWT, updateTodo);

// Delete todo
router.delete("/delete-todo/:todoId", verifyJWT, deleteTodo);

module.exports = router;
