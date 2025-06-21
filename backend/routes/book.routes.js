const express = require("express");
const router = express.Router();

const {
  createBook,
  updateBook,
  getFeaturedBooks,
  getBookbyId,
} = require("../controllers/book.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBook", isLoggedIn, createBook);

router.get("/featuredBook", isLoggedIn, getFeaturedBooks);

router.get("/:bookId", isLoggedIn, getBookbyId);

router.patch("/updateBook/:id", isLoggedIn, isAdmin, updateBook);

module.exports = router;
