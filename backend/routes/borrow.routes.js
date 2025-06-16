const express = require("express");
const router = express.Router();

const {
  sendBorrowRequest,
  handleBorrowRequest,
} = require("../controllers/borrow.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/send/borrowRequest/:bookId", isLoggedIn, sendBorrowRequest);

// Admin Only
router.patch(
  "/handle/borrowRequest/:requestId",
  isLoggedIn,
  handleBorrowRequest
);

module.exports = router;
