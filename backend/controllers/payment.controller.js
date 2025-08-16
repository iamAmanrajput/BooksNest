const Razorpay = require("razorpay");
require("dotenv").config();
const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.generatePayment = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { amount } = req.body;

    // Validation
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not logged in" });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    // Check user existence
    const user = await User.findById(userId).select("+isVerified");
    if (!user || !user.isVerified) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create Razorpay order
    const order = await instance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    // Save payment details
    await Payment.create({
      userId: userId,
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      status: "created",
    });

    return res.status(200).json({
      success: true,
      data: { ...order },
    });
  } catch (err) {
    console.error("Payment generation error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during payment generation",
      error: err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userId = req.user._id;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment details",
    });
  }

  try {
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "paid",
          verifiedAt: new Date(),
        }
      );

      await User.findByIdAndUpdate(userId, { fineAmount: 0 });

      return res.status(200).json({
        success: true,
        message: "Payment verified",
      });
    } else {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "failed" }
      );
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};
