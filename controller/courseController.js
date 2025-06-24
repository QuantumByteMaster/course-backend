const { userModel, courseModel, purchaseModel } = require("../db");

async function purchase(req, res) {
  const { email, title } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const course = await courseModel.findOne({ title: title });
    if (!course) {
      return res.status(404).json({
        message: "course not found",
      });
    }
    const alreadyPurchased = await purchaseModel.findOne({
      userid: user._id,
      courseid: course._id,
    });
    if (alreadyPurchased) {
      return res.status(409).json({
        message: "you have purchased the course",
      });
    }
    const newPurchase = await purchaseModel.create({
      userid: user._id,
      courseid: course._id,
    });
    res.status(201).json({
      message: "Purchase Succesfull",
      purchase: newPurchase,
    });
  } catch (e) {
    console.error("Server Error: ", e);
    return res.status(500).json({
      message: "Server Error!.pls try again after some time",
    });
  }
}

async function previewCourse(req, res) {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const purchase = await purchaseModel
      .find({ userid: user._id })
      .populate("courseid");
    const courses = purchase.map((p) => p.courseid);
    return res.status(200).json({
      message: "purchases courses retrieved properly",
      courses,
    });
  } catch (e) {
    console.error("Server Error", e);
    return res.status(500).json({
      message: "Server Error! pls try again some time",
    });
  }
}

module.exports = {
  purchase,
  previewCourse,
};
