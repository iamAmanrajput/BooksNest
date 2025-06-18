const Book = require("../models/book.model");
const User = require("../models/user.model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
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

    return res
      .status(201)
      .json({ success: true, message: "Book Created Successfully", newBook });
  } catch (error) {
    console.log("CreateBook Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// update Book
exports.updateBook = async (req, res) => {
  const { id: bookId } = req.params;
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
    let updatedData = {};
    if (title?.trim()) {
      updatedData.title = title.trim();
    }
    if (description?.trim()) {
      updatedData.description = description.trim();
    }
    if (quantity) {
      updatedData.quantity = Number(quantity);
      updatedData.availableQuantity = Number(quantity);
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
    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Book Updated Successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.log("Updating Book Error : ", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// get featured Book
exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ rating: -1 }).limit(10);

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
