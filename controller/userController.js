const z = require("zod");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET_USER;
const { userModel } = require("../db");

const userSchema = z.object({
  username: z
    .string()
    .min(3, "username must of 3 characters length")
    .max(30, "username must be less than 30 character length"),
  password: z
    .string()
    .min(8, "password must be of 8 character")
    .max(30, "max  password length is 30"),
  email: z.string().email("inavlid email format"),
});

async function Signup(req, res) {
  const { email, username, password } = req.body;
  let alreadyUser;
  try {
    userSchema.parse({ email, username, password });
  } catch (e) {
    console.error("there is a validation error", e);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: e.errors });
  }
  try {
    alreadyUser = await userModel.findOne({ username: username, email: email });
  } catch (e) {
    console.error("Error Checking user");
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
  if (alreadyUser) {
    return res.json({
      message:
        "user with this email or username already exists. Please sign in.",
    });
  } else {
    try {
      const hashedPass = await bcrypt.hash(password, 4);
      const newuser = await userModel.create({
        email: email,
        username: username,
        password: hashedPass,
      });
      return res.status(201).json({
        message: "user Registered Succesfully",
        user: {
          id: newuser._id,
          email: newuser.email,
          username: newuser.username,
        },
      });
    } catch (e) {
      console.error("failed to create user", e);
      return res.status(500).json({ message: "Failed to create user." });
    }
  }
}

async function Signin(req, res) {
  const { username, password, email } = req.body;
  let alreadyUser;
  try {
    userSchema.parse({ email, username, password });
  } catch (e) {
    console.error("there is a validation error", e);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: e.errors });
  }
  try {
    alreadyUser = await userModel.findOne({ username: username, email: email });
  } catch (e) {
    console.error("Error Checking user");
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
  if (!alreadyUser) {
    return res.status(404).json({ message: "user not found. Please sign up." });
  }
  try {
    const match = bcrypt.compare(password, alreadyUser.password);
    if (!match) {
      return res.status(401).json({ message: "inccorrect password" });
    }
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_USER is undefined");
    }
    const token = jwt.sign({ id: alreadyUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "Signin successful",
      token,
      admin: {
        id: alreadyUser._id,
        email: alreadyUser.email,
        username: alreadyUser.username,
      },
    });
  } catch (e) {
    console.error("Error during signin:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getCourses(req, res) {
  const redis = require("../redis");
  try {
    const cachedCourses = await redis.get("all_courses");
    if (cachedCourses) {
      return res.status(200).json({
        message: "Courses fetched from cache",
        courses: JSON.parse(cachedCourses),
      });
    }

    const courses = await require("../db").courseModel.find({});
    
    // Cache for 1 hour (3600 seconds)
    await redis.set("all_courses", JSON.stringify(courses), "EX", 3600);

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses: courses,
    });
  } catch (e) {
    console.error("Error fetching courses:", e);
    return res.status(500).json({ message: "Failed to fetch courses" });
  }
}
async function Signout(req, res) {}

module.exports = {
  Signup: Signup,
  Signin: Signin,
  getCourses: getCourses,
};
