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
