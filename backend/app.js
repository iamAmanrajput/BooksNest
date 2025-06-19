const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const { dbConnect } = require("./config/db");
dbConnect();

const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

const fileUpload = require("express-fileupload");

const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/review", require("./routes/review.routes"));

// Admin - Routes
app.use("/api/v1/book", require("./routes/book.routes"));
app.use("/api/v1/user", require("./routes/user.routes"));
app.use("/api/v1/borrow", require("./routes/borrow.routes"));

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
