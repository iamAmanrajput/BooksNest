const express = require("express");
const router = express.Router();

const { createReview } = require("../controllers/review.controller");
const { isLoggedIn, isUser } = require("../middlewares/verifyToken");

router.post("/createReview/:id", isLoggedIn, isUser, createReview);

module.exports = router;
