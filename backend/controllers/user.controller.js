const User = require("../models/user.model");
const BorrowRecord = require("../models/borrowRecord.model");

// Get All Users -- Admin
exports.getAllUsers = async (req, res) => {
  let { page, limit, category, search } = req.query;

  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    let query = { role: "user" };

    if (category === "blocked") {
      query.isBlocked = true;
    }

    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .select("fullName email profilePic isBlocked fineAmount borrowedRecords")
      .populate({
        path: "borrowedRecords",
        select: "status", // Only need status to calculate counts
      })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    // Prepare response with counts
    const usersWithBorrowStats = users.map((user) => {
      const totalBorrowedBooks = user.borrowedRecords.length;
      const currentlyBorrowedBooks = user.borrowedRecords.filter(
        (record) => record.status !== "returned"
      ).length;

      return {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        isBlocked: user.isBlocked,
        fineAmount: user.fineAmount,
        totalBorrowedBooks,
        currentlyBorrowedBooks,
      };
    });

    return res.status(200).json({
      success: true,
      data: usersWithBorrowStats,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Change User Account Status
exports.changeAccountStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User has been ${user.isBlocked ? "blocked" : "unblocked"}`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Error changing account status:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// get recent activity by user
exports.recentActivities = async (req, res) => {
  try {
    const records = await BorrowRecord.find({})
      .select("status updatedAt")
      .populate({
        path: "userId",
        select: "profilePic fullName",
      })
      .populate({
        path: "bookId",
        select: "title",
      })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recent activities",
    });
  }
};
