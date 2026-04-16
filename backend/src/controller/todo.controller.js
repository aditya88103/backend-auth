// Todo controller - todos ko manage karne ka logic

const fs = require("fs");
const path = require("path");

// hamara todos database file ka path
const DB_PATH = path.join(__dirname, "../database/todos.json");

// helper function - todos.json se todos padhke laao
function readTodos() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return []; // agar file nahi hai toh empty array return karo
  }
}

// updated todos ko file mein save karo
function writeTodos(todos) {
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2));
}

// -------------------------------------------
// GET ALL TODOS - logged in user ke todos
// GET /api/todo/get-todos
// -------------------------------------------
const getTodos = (req, res) => {
  try {
    const userId = req.user.id; // middleware se user id lelo
    const todos = readTodos();

    // sirf is user ke todos filter karo
    const userTodos = todos.filter((todo) => todo.userId === userId);

    res.status(200).json({
      message: "Todos fetched successfully",
      todos: userTodos,
    });
  } catch (err) {
    console.error("Error in getTodos", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------------------------------
// ADD NEW TODO
// POST /api/todo/add-todo
// -------------------------------------------
const addTodo = (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    // validation
    if (!title) {
      return res.status(400).json({ message: "Todo title is required" });
    }

    const todos = readTodos();

    // naya todo object banao
    const newTodo = {
      id: Date.now(), // unique id
      userId: userId, // kis user ka hai yeh todo
      title: title,
      description: description || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // todos array mein add karo
    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json({
      message: "Todo added successfully",
      todo: newTodo,
    });
  } catch (err) {
    console.error("Error in addTodo", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------------------------------
// UPDATE TODO (edit title, description, completed status)
// PUT /api/todo/update-todo/:todoId
// -------------------------------------------
const updateTodo = (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = parseInt(req.params.todoId);
    const { title, description, completed } = req.body;

    const todos = readTodos();

    // todo dhundo
    const todoIndex = todos.findIndex((t) => t.id === todoId && t.userId === userId);

    if (todoIndex === -1) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // update karo
    if (title !== undefined) todos[todoIndex].title = title;
    if (description !== undefined) todos[todoIndex].description = description;
    if (completed !== undefined) todos[todoIndex].completed = completed;

    writeTodos(todos);

    res.status(200).json({
      message: "Todo updated successfully",
      todo: todos[todoIndex],
    });
  } catch (err) {
    console.error("Error in updateTodo", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------------------------------
// DELETE TODO
// DELETE /api/todo/delete-todo/:todoId
// -------------------------------------------
const deleteTodo = (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = parseInt(req.params.todoId);

    let todos = readTodos();

    // check karo ki todo exist karta hai aur wo is user ka hai
    const todoIndex = todos.findIndex((t) => t.id === todoId && t.userId === userId);

    if (todoIndex === -1) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // todo remove karo
    todos.splice(todoIndex, 1);
    writeTodos(todos);

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteTodo", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// export all functions
module.exports = { getTodos, addTodo, updateTodo, deleteTodo };
