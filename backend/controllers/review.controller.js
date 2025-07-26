const Review = require("../models/review.model");
const Book = require("../models/book.model");

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

    await newReview.populate("user", "fullName");

    let book = await Book.findByIdAndUpdate(
      bookId,
      { $push: { reviews: newReview._id } },
      { new: true }
    );

    await book.calculateRating();

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

// delete Review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (!review.user.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    const book = await Book.findById(review.book);
    if (book) {
      book.reviews = book.reviews.filter((id) => !id.equals(review._id));
      await book.save();
      await book.calculateRating();
    }

    await Review.findByIdAndDelete(reviewId);

    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
