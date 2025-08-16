const User = require("../models/user.model");
const BorrowRecord = require("../models/borrowRecord.model");

// Get All Users -- Admin
exports.getAllUsers = async (req, res) => {
  let { page, limit, category = "", email = "" } = req.query;

  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const query = { isVerified: true };

    if (email.trim()) {
      email = email.trim().toLowerCase();
      query.email = { $regex: email, $options: "i" };
    }

    if (category) {
      if (category === "active") {
        query.isBlocked = false;
      } else if (category === "blocked") {
        query.isBlocked = true;
      }
    }

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const issuedBooks = await BorrowRecord.countDocuments({
          userId: user._id,
          status: "issued",
        });

        return { ...user, issuedBooks };
      })
    );

    return res.status(200).json({
      success: true,
      data: updatedUsers,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
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
    const { userId } = req.body;

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

// get users stats
exports.usersStats = async (req, res) => {
  try {
    const [totalUsers, unblockedUsers, blockedUsers] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
    ]);

    return res.status(200).json({
      success: true,
      data: { totalUsers, unblockedUsers, blockedUsers },
    });
  } catch (error) {
    console.error("Error in usersStats:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
