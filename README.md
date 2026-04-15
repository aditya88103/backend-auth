# 🔐 User Authentication System — Complete Guide

## 📁 Final Folder Structure

```
backend anti/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   └── auth.controller.js   ← All logic (register, login, etc.)
│   │   ├── routes/
│   │   │   └── auth.routes.js       ← URL → function mapping
│   │   ├── middleware/
│   │   │   └── verifyJWT.js         ← Security guard for protected routes
│   │   ├── database/
│   │   │   └── users.json           ← Our simple "database"
│   │   └── index.js                 ← Server entry point
│   ├── .env                         ← Secret keys (PORT, JWT_SECRET)
│   └── package.json
│
└── frontend/
    ├── index.html      ← Login page
    ├── register.html   ← Register page
    ├── forgot.html     ← Forgot password page
    ├── home.html       ← Protected home page
    ├── style.css       ← All shared styles
    └── script.js       ← All shared JavaScript
```

---

## 🚀 How to Run

### Step 1 — Start the Backend

Open a terminal and run:

```bash
cd "backend anti/backend"
npm run dev
```

You should see: ✅ Server is running on http://localhost:5000

### Step 2 — Start the Frontend

Open `frontend/index.html` using **VS Code Live Server** (right-click → Open with Live Server).

Default Live Server URL: `http://127.0.0.1:5500`

**IMPORTANT:** The backend CORS is configured for `http://127.0.0.1:5500`. If your Live Server uses a different address, update the `origin` in `backend/src/index.js`.

---

## 🧪 Step-by-Step Testing Flow

### ✅ Test 1 — Register a New User
1. Go to `http://127.0.0.1:5500/register.html`
2. Fill in: **Name**, **Email**, **Password**
3. Click **Create Account**
4. You should see a green toast: "Registered successfully!"
5. Open `backend/src/database/users.json` — your user should be there with a **hashed password**

### ✅ Test 2 — Login
1. Go to `http://127.0.0.1:5500/index.html`
2. Enter the same **Email** and **Password** you registered with
3. Click **Login**
4. You should see: "Welcome back, [Name]!" and be redirected to `home.html`
5. Open DevTools → Application → Cookies — you should see the `token` cookie!

### ✅ Test 3 — Protected Home Page
1. You're already on `home.html` after login
2. It should show: "Welcome, [Name]! You are logged in. 🎉"
3. Now clear the `token` cookie manually in DevTools, then refresh
4. You should be redirected back to login — proving the route is protected!

### ✅ Test 4 — Forgot Password
1. Go to `http://127.0.0.1:5500/forgot.html`
2. Enter your registered **Email** and a **New Password**
3. Click **Update Password**
4. Toast: "Password updated! Please login with new password."
5. Login again with the new password — it should work!

### ✅ Test 5 — Logout
1. On `home.html`, click the **Logout** button
2. Toast: "Logged out successfully!"
3. Try going to `home.html` directly — you should be redirected to login

---

## 🔑 Key Concepts Explained Simply

| Concept | What it Does |
|---------|--------------|
| **bcrypt** | Converts "mypassword" into a scrambled string. Can't be reversed. |
| **JWT** | A token (like a bus ticket) that proves you're logged in. |
| **Cookie** | Stores the JWT token in your browser. Sent automatically with each request. |
| **httpOnly Cookie** | JavaScript can't read this cookie — extra secure! |
| **Middleware (verifyJWT)** | Runs before protected routes to check if token is valid. |
| **CORS** | Allows the frontend (port 5500) to talk to backend (port 5000). |
| **credentials: "include"** | Tells `fetch()` to send cookies along with the request. |

---

## 🌐 API Endpoints Reference

| Method | URL | Description | Auth Required? |
|--------|-----|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user, get token cookie | No |
| GET | `/api/auth/home` | Get protected user data | Yes |
| POST | `/api/auth/forgot-password` | Reset user password | No |
| POST | `/api/auth/logout` | Clear the token cookie | No |

---

## 💡 How to Explain to Your Teacher

"I built a full-stack authentication system using Node.js for the backend and plain HTML/CSS/JS for the frontend.

- When a user **registers**, I hash their password using bcrypt and save them in a JSON file.
- When they **login**, I check the password and create a JWT token, which I store in an httpOnly cookie.
- For the **protected home route**, I wrote middleware that reads the cookie, verifies the JWT, and only allows access if it's valid.
- **Forgot password** finds the user by email and updates their hashed password.
- The frontend uses fetch() with credentials: 'include' so cookies are sent automatically."
