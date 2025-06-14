const express = require("express");
const router = express.Router();

const { createBook } = require("../controllers/book.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.post("/createBook", isLoggedIn, isAdmin, createBook);

module.exports = router;
