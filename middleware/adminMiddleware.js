const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

function adminMiddleware(req, res, next) {
  const authSecret = req.headers.authorization;
  if (!authSecret || !authSecret.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized, no Token Provided",
    });
  }
  const token = authSecret.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (e) {
    console.error("JWT Error:", e);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
