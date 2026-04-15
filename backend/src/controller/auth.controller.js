// yeh sabse important file hai
// isme register, login, home, forgot password aur logout ka logic hai

const fs = require("fs"); // file read/write ke liye
const path = require("path"); // correct file path banane ke liye
const bcrypt = require("bcryptjs"); // password hashing ke liye (kabhi bhi plain password save mat karo)
const jwt = require("jsonwebtoken"); // token banane aur verify karne ke liye

// hamara database file ka path
const DB_PATH = path.join(__dirname, "../database/users.json");

// -------------------------------------------
// helper functions - ye sirf is file mein use hote hain
// -------------------------------------------

// users.json se saare users padhke laao
function readUsers() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data); // JSON string ko JS array mein convert karo
}

// updated users array ko wapas file mein save karo
function writeUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2)); // 2 spaces se nice format mein save
}

// -------------------------------------------
// REGISTER - naya user banana
// POST /api/auth/register
// -------------------------------------------
const register = async (req, res) => {
  try {
    // frontend se jo data aaya woh lo
    const { name, email, password } = req.body;

    // check karo ki koi field empty toh nahi
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // existing users load karo
    const users = readUsers();

    // check karo ki yeh email pehle se registered toh nahi
    const alreadyExists = users.find((u) => u.email === email);
    if (alreadyExists) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    // password ko hash karo - kabhi bhi direct password save mat karo
    // bcrypt automatically salt add karta hai, 10 rounds kaafi hai
    const hashedPassword = await bcrypt.hash(password, 10);

    // naya user object banao
    const newUser = {
      id: Date.now(), // simple unique id ke liye timestamp use karta hoon
      name,
      email,
      password: hashedPassword,
    };

    // users array mein add karo aur file mein save karo
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "Registration successful! Please login." });
  } catch (err) {
    console.error("Error in registration", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------------------------------
// LOGIN - user ko login karna aur token dena
// POST /api/auth/login
// -------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // user dhundo database mein
    const users = readUsers();
    const user = users.find((u) => u.email === email);

    // agar user mila hi nahi
    if (!user) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    // jo password diya usse hashed password se compare karo
    // bcrypt.compare automatically hash karke match karta hai
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    // sab sahi hai toh JWT token banao
    // is token mein user ki basic info hogi
    // format: jwt.sign(payload, secret, options)
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 1 ghante ke liye valid rahega
    );

    // token ko JSON response mein bhejo
    // frontend localStorage mein save karega isse
    // yeh approach cross-origin (Live Server + Express) ke liye sahi hai
    res.status(200).json({ message: "Login successful!", name: user.name, token });
  } catch (err) {
    console.error("Error in login", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------------------------------
// HOME - protected route, sirf logged in user access kar sakta hai
// GET /api/auth/home
// yeh tab chalega jab verifyJWT middleware pass ho jaaye
// -------------------------------------------
const home = (req, res) => {
  // req.user mein woh data hai jo middleware ne set kiya tha token ke andar se
  const user = req.user;

  res.status(200).json({
    message: `Welcome ${user.name}! You are logged in 🎉`,
    user: user,
  });
};

// -------------------------------------------
// FORGOT PASSWORD - purana password change karna
// POST /api/auth/forgot-password
// -------------------------------------------
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const users = readUsers();

    // user ka index dhundo taaki hum directly update kar sakein
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ message: "Email not found" });
    }

    // naya password hash karo
    const hashedNewPass = await bcrypt.hash(newPassword, 10);

    // array mein us user ka password update karo
    users[userIndex].password = hashedNewPass;

    // wapas file mein save karo
    writeUsers(users);

    res.status(200).json({ message: "Password changed successfully! Please login with new password" });
  } catch (err) {
    console.error("Error in forgot password", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------------------------------
// LOGOUT - cookie hatao
// POST /api/auth/logout
// -------------------------------------------
const logout = (req, res) => {
  // frontend localStorage se token hatayega
  // backend ke paas kuch karne ko nahi kyunki cookie use nahi ho rahi
  res.status(200).json({ message: "Logout successful!" });
};

// sab functions export karo taaki routes use kar sakein
module.exports = { register, login, home, forgotPassword, logout };
