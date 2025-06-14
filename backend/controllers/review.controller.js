const Review = require("../models/review.model");

// create Review
exports.createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.id;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review and Rating are required",
      });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Prevent duplicate reviews by the same user for the same book
    const existingReview = await Review.findOne({ user: userId, book: bookId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      });
    }

    // Create new review
    const newReview = await Review.create({
      user: userId,
      book: bookId,
      rating: numericRating,
      comment: comment.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
