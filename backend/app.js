const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const { dbConnect } = require("./config/db");
dbConnect();

const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", require("./routes/auth.routes"));

app.get("/", (req, res) => {
  res.send("<h1>📚 Welcome to BooksNest Backend</h1>");
});

// 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});
