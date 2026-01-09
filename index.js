const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");
require("dotenv").config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", courseRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("database connected");
    app.listen(process.env.PORT, () => {
      console.log(`server running on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.error("failed to connect", e);
  }
}
main();
