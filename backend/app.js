const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const { dbConnect } = require("./config/db");
dbConnect();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("<h1>📚 Welcome to Library Backend</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
