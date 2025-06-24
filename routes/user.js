const { Router } = require("express");
const userRouter = Router();
const userController = require("../controller/userController");
const { userMiddleware } = require("../middleware/userMiddleware");

userRouter.post("/signup", userController.Signup);

userRouter.post("/signin", userController.Signin);

userRouter.get("/courses", userMiddleware, userController.getCourses);

module.exports = {
  userRouter: userRouter,
};
