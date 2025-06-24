const { Router } = require("express");
const adminRouter = Router();
const { adminMiddleware } = require("../middleware/adminMiddleware");
const adminController = require("../controller/adminController");

adminRouter.post("/signup", adminController.Signup);
adminRouter.post("/signin", adminController.Signin);
adminRouter.post("/create", adminMiddleware, adminController.createCourse);
adminRouter.post("/delete", adminMiddleware, adminController.deleteCourse);

module.exports = {
  adminRouter: adminRouter,
};
