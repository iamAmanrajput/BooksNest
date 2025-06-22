const express = require("express");
const router = express.Router();

const {
  createBook,
  updateBook,
  getFeaturedBooks,
  getBookbyId,
  getBooks,
} = require("../controllers/book.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBook", isLoggedIn, createBook);

router.get("/featuredBook", isLoggedIn, getFeaturedBooks);

router.get("/books", isLoggedIn, getBooks);

router.get("/:bookId", isLoggedIn, getBookbyId);

router.patch("/updateBook/:id", isLoggedIn, isAdmin, updateBook);

module.exports = router;
