// =====================================================
// script.js — Shared JavaScript for all frontend pages
// =====================================================

// The base URL of our backend server
const API_BASE = "http://localhost:5000/api/auth";

// ─────────────────────────────────────────────
// TOKEN HELPERS — localStorage use karte hain
// Cookie ki jagah localStorage better hai cross-origin ke liye
// ─────────────────────────────────────────────

// token save karo localStorage mein
function saveToken(token) {
  localStorage.setItem("authToken", token);
}

// token nikalo localStorage se
function getToken() {
  return localStorage.getItem("authToken");
}

// token hatao (logout ke waqt)
function removeToken() {
  localStorage.removeItem("authToken");
}

// Authorization header banao — har protected request mein yeh bhejte hain
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`, // "Bearer eyJhbGc..."
  };
}

// ─────────────────────────────────────────────
// TOAST NOTIFICATION FUNCTION
// ─────────────────────────────────────────────
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ─────────────────────────────────────────────
// SET BUTTON LOADING STATE
// ─────────────────────────────────────────────
function setLoading(btn, isLoading, text = "Submit") {
  if (isLoading) {
    btn.textContent = "Loading...";
    btn.classList.add("loading");
  } else {
    btn.textContent = text;
    btn.classList.remove("loading");
  }
}

// ─────────────────────────────────────────────
// PAGE: LOGIN (index.html)
// ─────────────────────────────────────────────
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("loginBtn");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    setLoading(btn, true, "Login");

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend se token aaya — localStorage mein save karo
        saveToken(data.token);

        showToast(`Welcome back, ${data.name}! 🎉`);
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Cannot connect to server. Is it running?", "error");
    } finally {
      setLoading(btn, false, "Login");
    }
  });
}

// ─────────────────────────────────────────────
// PAGE: REGISTER (register.html)
// ─────────────────────────────────────────────
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("registerBtn");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    setLoading(btn, true, "Register");

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Registered successfully! Please login.");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Cannot connect to server. Is it running?", "error");
    } finally {
      setLoading(btn, false, "Register");
    }
  });
}

// ─────────────────────────────────────────────
// PAGE: FORGOT PASSWORD (forgot.html)
// ─────────────────────────────────────────────
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("forgotBtn");
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;

    setLoading(btn, true, "Update Password");

    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Password updated! Please login with new password.");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Cannot connect to server. Is it running?", "error");
    } finally {
      setLoading(btn, false, "Update Password");
    }
  });
}

// ─────────────────────────────────────────────
// PAGE: HOME (home.html)
// ─────────────────────────────────────────────
const homePage = document.getElementById("homePage");
if (homePage) {
  // pehle check karo ki token hai bhi localStorage mein
  if (!getToken()) {
    // token hi nahi hai — seedha login bhejo
    window.location.href = "index.html";
  } else {
    // token hai — backend se verify karwao aur data lao
    loadHomeData();
  }
}

async function loadHomeData() {
  try {
    // Authorization header mein token bhejo — cookie ki zarurat nahi
    const response = await fetch(`${API_BASE}/home`, {
      method: "GET",
      headers: authHeaders(), // "Authorization: Bearer <token>"
    });

    if (response.ok) {
      const data = await response.json();
      const welcomeEl = document.getElementById("welcomeMsg");
      const userBadge = document.getElementById("userBadge");

      if (welcomeEl) welcomeEl.textContent = data.message;
      if (userBadge) userBadge.textContent = `👤 ${data.user.name}`;
    } else {
      // Token expire ho gaya ya invalid hai
      removeToken(); // purana token hatao
      showToast("Session expire ho gaya, please login again!", "error");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }
  } catch (error) {
    showToast("Cannot connect to server.", "error");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}

// Logout — localStorage se token hatao
async function logout() {
  try {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: authHeaders(),
    });
  } catch (error) {
    // server se error aaye toh bhi local logout karo
  } finally {
    removeToken(); // localStorage se token hatao
    showToast("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }
}

// ─────────────────────────────────────────────
// TODO FUNCTIONALITY
// ─────────────────────────────────────────────

const TODO_API_BASE = "http://localhost:5000/api/todo";

// todos.json se aur load karo page load hone par
if (homePage) {
  loadTodos();
}

// ─ Todos ko backend se load karo
async function loadTodos() {
  try {
    const response = await fetch(`${TODO_API_BASE}/get-todos`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      renderTodos(data.todos);
    } else {
      showToast("Could not load todos", "error");
    }
  } catch (error) {
    showToast("Cannot connect to server", "error");
  }
}

// ─ Naya todo add karo
async function addNewTodo() {
  const titleInput = document.getElementById("todoTitle");
  const descriptionInput = document.getElementById("todoDescription");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showToast("Please enter a todo title", "error");
    return;
  }

  try {
    const response = await fetch(`${TODO_API_BASE}/add-todo`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast("✅ Todo added successfully!");
      titleInput.value = "";
      descriptionInput.value = "";
      loadTodos(); // todos refresh karo
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("Cannot connect to server", "error");
  }
}

// ─ Todo ko delete karo
async function deleteTodo(todoId) {
  if (!confirm("Kya aap yeh todo delete karna chahte ho?")) {
    return;
  }

  try {
    const response = await fetch(`${TODO_API_BASE}/delete-todo/${todoId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await response.json();

    if (response.ok) {
      showToast("✅ Todo deleted!");
      loadTodos();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("Cannot connect to server", "error");
  }
}

// ─ Todo ko complete/incomplete toggle karo
async function toggleTodo(todoId, currentCompleted) {
  try {
    const response = await fetch(`${TODO_API_BASE}/update-todo/${todoId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ completed: !currentCompleted }),
    });

    if (response.ok) {
      loadTodos();
    } else {
      showToast("Could not update todo", "error");
    }
  } catch (error) {
    showToast("Cannot connect to server", "error");
  }
}

// ─ Edit todo - inline editing
async function editTodo(todoId, newTitle, newDescription) {
  if (!newTitle.trim()) {
    showToast("Title cannot be empty", "error");
    return;
  }

  try {
    const response = await fetch(`${TODO_API_BASE}/update-todo/${todoId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast("✅ Todo updated!");
      loadTodos();
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("Cannot connect to server", "error");
  }
}

// ─ Todos ko HTML mein render karo
function renderTodos(todos) {
  const todosList = document.getElementById("todosList");

  if (!todosList) return;

  if (todos.length === 0) {
    todosList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        <p style="font-size: 3rem; margin-bottom: 0.5rem;">📭</p>
        <p>Koi todo nahi hai! Naya add karo aur shuru karo 🚀</p>
      </div>
    `;
    return;
  }

  todosList.innerHTML = todos
    .map(
      (todo) => `
      <div class="todo-item ${todo.completed ? "completed" : ""}">
        <div class="todo-header">
          <div class="todo-title">${escapeHtml(todo.title)}</div>
        </div>
        
        ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ""}
        
        <div class="todo-actions">
          <button class="todo-btn todo-btn-complete" onclick="toggleTodo(${todo.id}, ${todo.completed})">
            ${todo.completed ? "↩️ Uncomplete" : "✓ Complete"}
          </button>
          <button class="todo-btn todo-btn-edit" onclick="openEditTodo(${todo.id})">
            ✎ Edit
          </button>
          <button class="todo-btn todo-btn-delete" onclick="deleteTodo(${todo.id})">
            🗑️ Delete
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

// ─ Edit todo inline
function openEditTodo(todoId) {
  const todoItem = event.target.closest(".todo-item");
  const titleEl = todoItem.querySelector(".todo-title");
  const descEl = todoItem.querySelector(".todo-description");
  const actionsEl = todoItem.querySelector(".todo-actions");

  const currentTitle = titleEl.textContent;
  const currentDesc = descEl ? descEl.textContent : "";

  const newTitle = prompt("Edit todo title:", currentTitle);
  if (newTitle === null) return;

  const newDesc = prompt("Edit todo description:", currentDesc);

  editTodo(todoId, newTitle, newDesc || "");
}

// ─ HTML mein special characters ko escape karo (security)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
