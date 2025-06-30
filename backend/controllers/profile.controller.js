const BorrowRecord = require("../models/borrowRecord.model");
const User = require("../models/user.model");

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
