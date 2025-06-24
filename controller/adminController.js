const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET_ADMIN;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const z = require("zod");

const adminSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password must be 8 characters"),
  username: z.string(),
});

const courseSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  imageurl: z.string(),
});

async function Signup(req, res) {
  const { email, password, username } = req.body;
  try {
    adminSchema.parse({ email, password, username });
  } catch (e) {
    console.error("validation failed", e);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: e.errors });
  }
  let alreadyAdmin;
  try {
    alreadyAdmin = await adminModel.findOne({
      email: email,
      username: username,
    });
  } catch (e) {
    console.error("Error checking admin", e);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
  if (alreadyAdmin) {
    return res.status(400).json({
      message:
        "Admin with this email or username already exists. Please sign in.",
    });
  } else {
    try {
      const hashedPass = await bcrypt.hash(password, 4);
      const newAdmin = await adminModel.create({
        email: email,
        password: hashedPass,
        username: username,
      });
      return res.status(201).json({
        message: "Admin Registered Succesfully",
        admin: {
          id: newAdmin._id,
          email: newAdmin.email,
          username: newAdmin.username,
        },
      });
    } catch (e) {
      console.error("failed to create admin", e);
      return res.status(500).json({ message: "Failed to create admin." });
    }
  }
}
async function Signin(req, res) {
  const { email, username, password } = req.body;
  try {
    adminSchema.parse({ username, email, password });
  } catch (e) {
    console.error("valdiation failed", e);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: e.errors });
  }
  let alreadyAdmin;
  try {
    alreadyAdmin = await adminModel.findOne({
      username: username,
      email: email,
    });
  } catch (e) {
    console.error("There has been a database Error", e);
    return res.status(500).json({ message: "Database error" });
  }
  if (!alreadyAdmin) {
    return res
      .status(404)
      .json({ message: "Admin not found. Please sign up." });
  }
  try {
    const match = await bcrypt.compare(password, alreadyAdmin.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "You have entered wrong password" });
    }
    const token = jwt.sign(
      { id: alreadyAdmin._id, username: alreadyAdmin.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({
      message: "Signin successful",
      token,
      admin: {
        id: alreadyAdmin._id,
        email: alreadyAdmin.email,
        username: alreadyAdmin.username,
      },
    });
  } catch (e) {
    return res.status(501).json({
      message: "there is a error",
    });
  }
}
async function createCourse(req, res) {
  const { title, description, price, imageurl } = req.body;
  const creatorId = req.admin.id;
  try {
    courseSchema.parse({ title, description, price, imageurl });
  } catch (e) {
    console.error("incorrect data error :", e);
    return res.status(401).json({
      message: "incorrect data format",
    });
  }
  try {
    const course = await courseModel.create({
      title: title,
      description: description,
      price: price,
      imageurl: imageurl,
      creator: creatorId,
    });
    res.status(201).json({
      message: "course created",
      courseDescription: course,
    });
  } catch (e) {
    console.error("database error or something not working right on DB ", e);
    return res.status(501).json({
      message: "Server Error !. pls try again later after some time",
    });
  }
}

async function deleteCourse(req, res) {
  const { courseId } = req.body;
  const adminId = req.admin.id;
  let courseFound;
  try {
    courseFound = await courseModel.findOne({
      _id: courseId,
      creator: adminId,
    });
    if (courseFound) {
      await courseModel.deleteOne({ _id: courseId, creator: adminId });
      return res.status(200).json({ message: "Course has  been deleted" });
    } else {
      return res.status(401).json({
        message: "There doesnt exist a course ",
      });
    }
  } catch (e) {
    console.error("database error or something not working right on DB ", e);
    return res.status(501).json({
      message: "Server Error !. pls try again later after some time",
    });
  }
}

module.exports = {
  Signup,
  Signin,
  createCourse,
  deleteCourse,
};
