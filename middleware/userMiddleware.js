const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_USER;
function userMiddleware(req, res, next) {
  const authSecret = req.headers.authorization;
  if (!authSecret) {
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
    return res.status(401).json({ message: "Unauthorized: Inalvid TOken" });
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
