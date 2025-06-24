const { Router } = require("express");
const { userMiddleware } = require("../middleware/userMiddleware");
const courseController = require("../controller/courseController");
const courseRouter = Router();

courseRouter.get("/preview", userMiddleware, courseController.previewCourse);
courseRouter.post("/purchaseCourse", userMiddleware, courseController.purchase);

module.exports = {
  courseRouter: courseRouter,
};
