// yeh hamara main server file hai
// iske andar hum express setup karte hain aur sab kuch connect karte hain

// sabse pehle .env file load karo taaki PORT aur JWT_SECRET milein
require("dotenv").config();
const express = require("express");
const cors = require("cors"); // yeh frontend ko backend se baat karne deta hai
const cookieParser = require("cookie-parser"); // cookies padhne ke liye

// routes import karo
const authRoutes = require("./routes/auth.routes");
const todoRoutes = require("./routes/todo.routes");

const app = express();

// PORT .env se lelo, agar wahan nahi hai toh 5000 use karo
const PORT = process.env.PORT || 5000;

// middleware setup

// cors lagao taaki browser error na de jab frontend backend ko call kare
// development ke liye sab origins allow kar rahe hain
app.use(
  cors({
    origin: "*", // development mein sab domains allow kar rahe hain
    credentials: false, // "*" ke saath credentials false zaruri hai
  })
);

// yeh middleware req.body se JSON data padhne deta hai
app.use(express.json());

// yeh middleware request mein se cookies padhne deta hai
app.use(cookieParser());

// routes connect karo
// matlab jab bhi /api/auth/kuch aayega, woh authRoutes ko jayega
app.use("/api/auth", authRoutes);

// todo routes connect karo
// jab bhi /api/todo/kuch aayega, woh todoRoutes ko jayega
app.use("/api/todo", todoRoutes);

// server start karo
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
