const express = require("express");
const router = express.Router();

const {
  createBook,
  updateBook,
  getFeaturedBooks,
  getBookbyId,
  getBooks,
  getOverviewStats,
} = require("../controllers/book.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBook", isLoggedIn, isAdmin, createBook);

router.get("/featuredBook", isLoggedIn, getFeaturedBooks);

router.get("/books", isLoggedIn, getBooks);

router.get("/overviewStats", isLoggedIn, isAdmin, getOverviewStats);

router.get("/:bookId", isLoggedIn, getBookbyId);

router.patch("/updateBook/:id", isLoggedIn, isAdmin, updateBook);

module.exports = router;
