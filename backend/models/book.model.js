const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, "Quantity cannot be negative"],
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    authors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    genres: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    language: {
      type: String,
      default: "English",
      trim: true,
    },
    coverImage: {
      publicId: {
        type: String,
      },
      imageUrl: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
