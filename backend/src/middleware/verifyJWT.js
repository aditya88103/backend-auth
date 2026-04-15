// yeh middleware hai jo check karta hai ki user ke paas valid token hai ya nahi
// jab bhi koi protected route open karta hai, pehle yahi function chalta hai

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Authorization header se token nikalo
  // Frontend "Authorization: Bearer <token>" header bhejta hai
  const authHeader = req.headers["authorization"];

  // header ka format: "Bearer eyJhbGc..." — humein sirf token chahiye
  const token = authHeader && authHeader.split(" ")[1];

  // agar token hi nahi mila matlab user logged in nahi hai
  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  // ab token verify karo ki sahi hai ya nahi
  try {
    // jwt.verify token check karta hai aur andar ka data bhi deta hai
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded data ko req.user mein save karo
    // isse aage wale function mein user ki info milegi
    req.user = decoded;

    // sab theek hai, aage badho
    next();
  } catch (err) {
    // token galat hai ya expire ho gaya
    return res.status(401).json({ message: "Token invalid or expired, please login again" });
  }
};

module.exports = verifyJWT;
