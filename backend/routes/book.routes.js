const express = require("express");
const router = express.Router();

const {
  createBook,
  updateBook,
  getFeaturedBooks,
} = require("../controllers/book.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBook", isLoggedIn, createBook);

router.patch("/updateBook/:id", isLoggedIn, isAdmin, updateBook);

router.get("/featuredBook", getFeaturedBooks);

module.exports = router;
