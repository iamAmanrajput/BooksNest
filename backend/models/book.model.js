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
    authors: {
      type: [String],
      default: [],
    },
    genres: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
