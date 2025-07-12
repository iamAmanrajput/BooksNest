const express = require("express");
const router = express.Router();

const {
  createBook,
  updateBook,
  getFeaturedBooks,
  getBookbyId,
  getBooks,
  getOverviewStats,
  softDeleteBook,
  restoreBook,
} = require("../controllers/book.controller");

const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

// Book routes
router.post("/createBook", isLoggedIn, isAdmin, createBook);

router.patch("/update", isLoggedIn, isAdmin, updateBook);

router.patch("/softDelete", isLoggedIn, isAdmin, softDeleteBook);

router.patch("/restore", isLoggedIn, isAdmin, restoreBook);

router.get("/featuredBook", isLoggedIn, getFeaturedBooks);

router.get("/books", isLoggedIn, getBooks);

router.get("/overviewStats", isLoggedIn, isAdmin, getOverviewStats);

router.get("/:bookId", isLoggedIn, getBookbyId);

module.exports = router;
