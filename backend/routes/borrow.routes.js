const express = require("express");
const router = express.Router();

const {
  sendBorrowRequest,
  handleBorrowRequest,
  sendReturnRequest,
  handleReturnRequest,
  renewBook,
} = require("../controllers/borrow.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

router.get("/send/borrowRequest/:bookId", isLoggedIn, sendBorrowRequest);
router.get("/send/returnRequest/:requestId", isLoggedIn, sendReturnRequest);
router.patch("/send/renewRequest/:requestId", isLoggedIn, renewBook)

// Admin Only
router.patch(
  "/handle/borrowRequest/:requestId",
  isLoggedIn,
  handleBorrowRequest
);
router.patch(
  "/handle/returnRequest/:requestId",
  isLoggedIn,
  handleReturnRequest
);

module.exports = router;
