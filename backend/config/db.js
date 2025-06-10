const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

module.exports.dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Connection Issue : ", error.message);
    process.exit(1);
  }
};
