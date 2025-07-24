const express = require("express");
const router = express.Router();

const {
  adminSignin,
  adminSignup,
  adminLogout,
} = require("../controllers/admin.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");
const analyticsController = require("../controllers/analytics.controller");

router.post("/signup", adminSignup);

router.post("/signin", adminSignin);

router.get("/logout", isLoggedIn, adminLogout);

// Analytics endpoints
router.get(
  "/analytics/summary",
  isLoggedIn,
  isAdmin,
  analyticsController.getSummaryAnalytics
);
router.get(
  "/analytics/issued-books-per-month",
  isLoggedIn,
  isAdmin,
  analyticsController.getIssuedBooksPerMonth
);
router.get(
  "/analytics/users-per-month",
  isLoggedIn,
  isAdmin,
  analyticsController.getUsersPerMonth
);
router.get(
  "/analytics/top-borrowed-books",
  isLoggedIn,
  isAdmin,
  analyticsController.getTopBorrowedBooks
);
router.get(
  "/analytics/recent-activity",
  isLoggedIn,
  isAdmin,
  analyticsController.getRecentUserActivity
);

module.exports = router;
