const express = require("express");
const router = express.Router();

const {
  createReview,
  deleteReview,
} = require("../controllers/review.controller");
const { isLoggedIn, isUser } = require("../middlewares/verifyToken");

router.post("/createReview/:id", isLoggedIn, isUser, createReview);
router.delete("/delete/:reviewId", isLoggedIn, isUser, deleteReview);

module.exports = router;
