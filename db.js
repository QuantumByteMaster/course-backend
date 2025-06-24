const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  username: { type: String, unique: true },
});

const courseSchema = new Schema({
  title: { type: String, unique: true },
  description: { type: String },
  price: Number,
  creator: {
    type: ObjectId,
    ref: "admin",
    required: true,
  },
  imageUrl: String,
});

const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  username: { type: String, unique: true },
});

const purchaseSchema = new Schema({
  userid: {
    type: ObjectId,
    ref: "user",
    required: true,
  },
  courseid: {
    type: ObjectId,
    ref: "course",
    required: true,
  },
});

const courseModel = mongoose.model("course", courseSchema);
const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
  courseModel,
  userModel,
  adminModel,
  purchaseModel,
};
