const express = require("express");
const router = express.Router();

const {
  sendBorrowRequest,
  handleBorrowRequest,
  sendReturnRequest,
  handleReturnRequest,
  renewBook,
  getBorrowHistory,
} = require("../controllers/borrow.controller");

const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");

// USER ROUTES (Authenticated)

// View borrow history
router.get("/history", isLoggedIn, getBorrowHistory);

// Send borrow request
router.get("/send/borrowRequest/:bookId", isLoggedIn, sendBorrowRequest);

// Send return request
router.get("/send/returnRequest/:requestId", isLoggedIn, sendReturnRequest);

// Send renew request
router.patch("/send/renewRequest/:requestId", isLoggedIn, renewBook);

// ADMIN ROUTES

// Handle borrow request
router.patch(
  "/handle/borrowRequest/:requestId",
  isLoggedIn,
  isAdmin,
  handleBorrowRequest
);

// Handle return request
router.patch(
  "/handle/returnRequest/:requestId",
  isLoggedIn,
  isAdmin,
  handleReturnRequest
);

module.exports = router;
