const express = require("express");
const router = express.Router();
const { isLoggedIn, isUser } = require("../middlewares/verifyToken");
const {
  generatePayment,
  verifyPayment,
} = require("../controllers/payment.controller");

router.post("/generate-payment", isLoggedIn, isUser, generatePayment);
router.post("/verify-payment", isLoggedIn, isUser, verifyPayment);

module.exports = router;
