const express = require("express");
const router = express.Router();

const {
  sendBorrowRequest,
  handleBorrowRequest,
  sendReturnRequest,
  handleReturnRequest,
  renewBook,
  getBorrowHistory,
  issueBookUsingEmail,
  getRequestStats,
  fetchRequestData,
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

// Requests Stats
router.get("/requestStats", isLoggedIn, isAdmin, getRequestStats);

// Requests Data
router.get("/requestData", isLoggedIn, isAdmin, fetchRequestData);

// Issue Book Using Email
router.post("/issueBook", isLoggedIn, isAdmin, issueBookUsingEmail);

// Handle borrow request
router.patch("/handle/borrowRequest", isLoggedIn, isAdmin, handleBorrowRequest);

// Handle return request
router.patch("/handle/returnRequest", isLoggedIn, isAdmin, handleReturnRequest);

module.exports = router;
