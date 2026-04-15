// yeh file sab routes define karti hai
// matlab kaun sa URL kaun se function ko call karega

const express = require("express");
const router = express.Router();

// controller se sab functions import karo
const { register, login, home, forgotPassword, logout } = require("../controller/auth.controller");

// middleware import karo jo check karega ki user logged in hai ya nahi
const verifyJWT = require("../middleware/verifyJWT");

// register route - naya user banane ke liye
router.post("/register", register);

// login route - user login karne ke liye
router.post("/login", login);

// home route - yeh protected hai, pehle verifyJWT chalega
// agar token sahi hai tabhi home function chalega
router.get("/home", verifyJWT, home);

// forgot password route
router.post("/forgot-password", forgotPassword);

// logout route - cookie clear karne ke liye
router.post("/logout", logout);

module.exports = router;
