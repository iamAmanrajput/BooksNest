const Book = require("../models/book.model");
const User = require("../models/user.model");
const BorrowRecord = require("../models/borrowRecord.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// create Book
exports.createBook = async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      authors,
      genres,
      keywords,
      language,
    } = req.body;

    const courseImage = req?.files?.image || null;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !language?.trim() ||
      !quantity ||
      !courseImage
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required" });
    }

    if (!authors || authors.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Author is Required" });
    }
    if (!genres || genres.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Generes is Required" });
    }
    if (!keywords || keywords.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Keywords is Required" });
    }

    const coverImage = await uploadImageToCloudinary(
      courseImage,
      process.env.CLOUD_COVER_IMAGE_FOLDER
    );

    const newBook = await Book.create({
      title,
      description,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
      authors,
      genres,
      keywords,
      language,
      coverImage: {
        publicId: coverImage.public_id,
        imageUrl: coverImage.secure_url,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Book Created Successfully",
      data: newBook,
    });
  } catch (error) {
    console.log("CreateBook Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// Get Book by Id
exports.getBookbyId = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "fullName profilePic",
      },
    });
    if (!book) {
      return res
        .status(400)
        .json({ success: false, message: "BookData not found", data: {} });
    }
    return res.status(200).json({
      success: true,
      message: "book fetched successfully",
      data: book,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get Books
exports.getBooks = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const availability = req.query.availability;
    const selectedGenre = (req.query.genre || "").trim();
    const selectedLanguage = (req.query.language || "").trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { keywords: { $elemMatch: { $regex: regex } } },
        { authors: { $elemMatch: { $regex: regex } } },
      ];
    }

    if (selectedGenre) {
      query.genres = { $in: [selectedGenre] };
    }

    if (selectedLanguage) {
      query.language = selectedLanguage;
    }

    if (availability === "Available") {
      query.availableQuantity = { $gt: 0 };
    } else if (availability === "Unavailable") {
      query.availableQuantity = 0;
    }

    const skip = (page - 1) * limit;

    const [totalBooks, books] = await Promise.all([
      Book.countDocuments(query),
      Book.find(query)
        .select(
          "title description quantity availableQuantity authors genres keywords language rating coverImage isDeleted"
        )
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        totalBooks,
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        pageSize: limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("Error in getBooks:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching books.",
    });
  }
};

// update Book
exports.updateBook = async (req, res) => {
  const {
    title,
    description,
    quantity,
    authors,
    genres,
    keywords,
    language,
    bookId,
  } = req.body;
  const courseImage = req?.files?.image || null;

  let updatedData = {};

  if (title?.trim()) {
    updatedData.title = title.trim();
  }

  if (description?.trim()) {
    updatedData.description = description.trim();
  }

  if (quantity !== undefined) {
    const qty = Number(quantity);
    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be 1.",
      });
    }
    updatedData.quantity = qty;
    updatedData.availableQuantity = qty;
  }

  if (authors && authors.length !== 0) {
    updatedData.authors = authors;
  }

  if (genres && genres.length !== 0) {
    updatedData.genres = genres;
  }

  if (keywords && keywords.length !== 0) {
    updatedData.keywords = keywords;
  }

  if (language?.trim()) {
    updatedData.language = language.trim();
  }

  try {
    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Book Not Found",
      });
    }

    // Handle image update with Promise.all
    if (courseImage) {
      const [_, uploadResponse] = await Promise.all([
        cloudinary.uploader.destroy(book.coverImage.publicId),
        uploadImageToCloudinary(
          courseImage,
          process.env.CLOUD_COVER_IMAGE_FOLDER
        ),
      ]);

      updatedData.coverImage = {
        publicId: uploadResponse.public_id,
        imageUrl: uploadResponse.secure_url,
      };
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Book Updated Successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Updating Book Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// get featured Book
exports.getFeaturedBooks = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  try {
    const books = await Book.find({ isDeleted: false })
      .select(
        "title description availableQuantity authors genres language rating coverImage"
      )
      .sort({ rating: -1 })
      .limit(limit);

    if (!books || books.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No Books Available", data: [] });
    }

    return res
      .status(200)
      .json({ success: true, message: "Featured Books Fetched", data: books });
  } catch (error) {
    console.error("Error in getFeaturedBooks:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// get stats of fetch totalBooks, availableBooks, total borrowings, overdueBooks
exports.getOverviewStats = async (req, res) => {
  try {
    const [bookStats, issuedBooks, overdueBooks] = await Promise.all([
      Book.aggregate([
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$quantity" },
            availableBooks: { $sum: "$availableQuantity" },
          },
        },
      ]),
      BorrowRecord.countDocuments({
        status: { $in: ["issued", "return_requested"] },
      }),
      BorrowRecord.countDocuments({
        dueDate: { $lt: new Date() },
        status: "issued",
      }),
    ]);

    const stats = {
      totalBooks: bookStats[0]?.totalQuantity || 0,
      availableBooks: bookStats[0]?.availableBooks || 0,
      issuedBooks,
      overdueBooks,
    };

    res.status(200).json({
      success: true,
      message: "Overview stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview stats",
      error: error.message,
    });
  }
};

// soft delete book
exports.softDeleteBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Book Not Found",
      });
    }

    // Check for active borrow records
    const records = await BorrowRecord.find({
      bookId,
      status: {
        $in: ["pending", "issued", "queued"],
      },
    });

    if (records.length !== 0) {
      const messageType = {
        pending: "Someone has requested this book.",
        issued: "Someone has already borrowed this book.",
        queued: "Someone is in queue for this book.",
      };

      return res.status(400).json({
        success: false,
        message:
          messageType[records[0].status] || "This book is currently in use.",
      });
    }

    // Soft delete the book
    book.isDeleted = true;
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully.",
    });
  } catch (error) {
    console.error("Soft delete book error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// restore soft-deleted book
exports.restoreBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    // Step 1: Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    // Step 2: If already restored
    if (!book.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Book is already active.",
      });
    }

    // Step 3: Restore it
    book.isDeleted = false;
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book restored successfully.",
    });
  } catch (error) {
    console.error("Restore Book Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while restoring the book.",
    });
  }
};

