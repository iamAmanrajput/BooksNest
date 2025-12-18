const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const { commonEmailTemplate } = require("../templates/commonEmailTemplate");
const dotenv = require("dotenv");
dotenv.config();

// generate verification token
function generateVerificationToken(expiryMinutes = 15) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000; // expiry in ms
  return { token, expiresAt };
}

// Register User
module.exports.register = async (req, res) => {
  let { fullName, email, password, gender } = req.body;

  fullName = fullName?.trim();
  email = email?.trim().toLowerCase();
  gender = gender?.trim().toLowerCase();

  if (!fullName || !email || !password || !gender) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  if (!["male", "female"].includes(gender)) {
    return res.status(400).json({
      success: false,
      message: "Gender must be either 'male' or 'female'",
    });
  }

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${fullName}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${fullName}`;
  const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

  try {
    const existingUser = await User.findOne({ email }).select("+isVerified");
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      } else {
        const { token, expiresAt } = generateVerificationToken();
        existingUser.verificationToken = token;
        existingUser.verificationTokenExpire = expiresAt;
        existingUser.fullName = fullName;
        existingUser.password = password;
        existingUser.gender = gender;
        existingUser.profilePic.imageUrl = profilePic;
        await existingUser.save();
        const verificationLink = `${process.env.CLIENT_URL}/verify?token=${token}`;
        await mailSender(
          email,
          "Verify your email - NexLib",
          commonEmailTemplate(`
          <h1>Verify Your Email</h1>
          <p>Hello ${fullName},</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 15 minutes.</p>
        `)
        );
        return res.status(200).json({
          success: true,
          message: "Verification email resent. Please check your inbox.",
        });
      }
    }

    const { token, expiresAt } = generateVerificationToken();

    const newUser = await User.create({
      fullName,
      email,
      password,
      gender,
      profilePic: {
        imageUrl: profilePic,
      },
      verificationTokenExpire: expiresAt,
      verificationToken: token,
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify?token=${token}`;
    try {
      await mailSender(
        email,
        "Verify your email - NexLib",
        commonEmailTemplate(`
          <h1>Verify Your Email</h1>
          <p>Hello ${fullName},</p>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 15 minutes.</p>
        `)
      );
    } catch (err) {
      await User.findByIdAndDelete(newUser._id);
      throw err;
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("User Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// verify email
module.exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpire: { $gt: Date.now() },
    }).select("+isVerified");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: user,
    });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Login User
module.exports.login = async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim()?.toLowerCase();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password +isVerified");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your email address is not verified",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        gender: user.gender,
        profilePic: user.profilePic.imageUrl,
        fineAmount: user.fineAmount,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Logout User
module.exports.logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email is registered, a reset link has been sent.",
      });
    }

    // Generate token & expiry
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Prepare reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Prepare email
    const title = "Password Reset Request";
    const message = commonEmailTemplate(
      `You requested a password reset.<br/>
  If you did not request this, please ignore this email.<br/><br/>
  <a href="${resetLink}">Click here to reset your password</a><br/><br/>
  Note: This password reset link is valid for only 1 hour.<br/>
  After that, you will need to request a new password reset.`
    );

    // Send email
    await mailSender(user.email, title, message);

    return res.status(200).json({
      success: true,
      message: "If this email is registered, a reset link has been sent.",
    });
  } catch (err) {
    console.log("ERROR IN FORGOT PASSWORD:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    user.password = password;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    // User save karo
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
