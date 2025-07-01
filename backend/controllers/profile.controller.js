const BorrowRecord = require("../models/borrowRecord.model");
const User = require("../models/user.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// get Borrow books Count Stats
exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Parallel promises
    const [issuedBooksCount, returnedBooksCount, user, overdueBooksCount] =
      await Promise.all([
        BorrowRecord.countDocuments({ userId, status: "issued" }),
        BorrowRecord.countDocuments({ userId, status: "returned" }),
        User.findById(userId).select("+fineAmount"),
        BorrowRecord.countDocuments({
          userId,
          dueDate: { $lt: new Date() },
          status: "issued",
        }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        issuedBooksCount,
        returnedBooksCount,
        totalFines: user?.fineAmount || 0,
        overdueBooksCount,
      },
    });
  } catch (error) {
    console.error("Error in getProfileStats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get current user profile data
exports.getCurrentUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, issuedBooksCount, totalBorrowedBooks] = await Promise.all([
      User.findById(userId)
        .select(
          "fullName email gender profilePic fineAmount wishlist createdAt updatedAt profileLastUpdated"
        )
        .lean(),
      BorrowRecord.countDocuments({ userId, status: "issued" }),
      BorrowRecord.countDocuments({
        userId,
        status: { $in: ["issued", "returned"] },
      }),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      issuedBooksCount,
      totalBorrowedBooks,
    });
  } catch (error) {
    console.error("Error in getCurrentUserData:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
    });
  }
};

// update profile
exports.updateProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    let { fullName, email, gender } = req.body;

    // Validation
    if (!fullName?.trim() || !email?.trim() || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    fullName = fullName.trim();
    email = email.trim();

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    // Fetch current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    user.fullName = fullName;
    user.email = email;
    user.gender = gender;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update password
exports.updatePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      !currentPassword?.trim() ||
      !newPassword?.trim() ||
      !confirmPassword?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    // Check current password
    const isMatched = await user.comparePassword(currentPassword);
    if (!isMatched) {
      return res.status(403).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update profilePic
exports.updateProfilePic = async (req, res) => {
  const userId = req.user._id;

  try {
    // Check if image exists
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const image = req.files.image;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old image from Cloudinary (if any)
    if (user.profilePic?.publicId) {
      await cloudinary.uploader.destroy(user.profilePic.publicId);
    }

    // Upload new image to Cloudinary
    const response = await uploadImageToCloudinary(
      image,
      process.env.CLOUD_PROFILE_PIC_FOLDER
    );

    // Save new image details
    user.profilePic.publicId = response.public_id;
    user.profilePic.imageUrl = response.secure_url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: user.profilePic,
    });
  } catch (error) {
    console.log("Update Profile Pic Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
