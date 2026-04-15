// yeh hamara main server file hai
// iske andar hum express setup karte hain aur sab kuch connect karte hain

// sabse pehle .env file load karo taaki PORT aur JWT_SECRET milein
require("dotenv").config();
const express = require("express");
const cors = require("cors"); // yeh frontend ko backend se baat karne deta hai
const cookieParser = require("cookie-parser"); // cookies padhne ke liye

// auth routes import karo
const authRoutes = require("./routes/auth.routes");

const app = express();

// PORT .env se lelo, agar wahan nahi hai toh 5000 use karo
const PORT = process.env.PORT || 5000;

// middleware setup

// cors lagao taaki browser error na de jab frontend backend ko call kare
// origin woh URL hai jahan hamara frontend chal raha hai (live server ka default)
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true, // yeh important hai - iske bina cookie nahi jayegi frontend tak
  })
);

// yeh middleware req.body se JSON data padhne deta hai
app.use(express.json());

// yeh middleware request mein se cookies padhne deta hai
app.use(cookieParser());

// routes connect karo
// matlab jab bhi /api/auth/kuch aayega, woh authRoutes ko jayega
app.use("/api/auth", authRoutes);

// server start karo
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
