const express = require("express");
const router = express.Router();

const { createBook, updateBook } = require("../controllers/book.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBook", isLoggedIn, isAdmin, createBook);

router.patch("/updateBook/:id", isLoggedIn, isAdmin, updateBook);

module.exports = router;
