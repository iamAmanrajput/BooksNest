const mongoose = require("mongoose");
const Review = require("./review.model");
const mailSender = require("../utils/mailSender");

// Allowed Genres Enum List
const allowedGenres = [
  // Fiction
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Horror",
  "Romance",
  "Historical Fiction",
  "Adventure",
  "Drama",
  "Dystopian",
  "Young Adult",
  "Children",
  "Graphic Novel",
  "Mythology",
  "Satire",
  "Short Stories",

  // Non-Fiction
  "Biography",
  "Autobiography",
  "Memoir",
  "History",
  "Science",
  "Self-Help",
  "Psychology",
  "Philosophy",
  "Religion",
  "Politics",
  "Business",
  "Economics",
  "Technology",
  "Education",
  "Travel",
  "Health",
  "Art",
  "Photography",
  "Law",
  "Cooking",
  "Parenting",
  "Language",

  // Academic
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Engineering",
  "Medical",
  "Environmental Studies",
  "Sociology",
  "Anthropology",
  "Literature",
  "Statistics",
  "Civics",
  "Geography",
  "Accountancy",
  "Commerce",
];

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
        enum: allowedGenres,
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
      enum: ["English", "Hindi", "French", "Spanish", "German"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
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

bookSchema.methods.calculateRating = async function () {
  const reviews = await Review.find({ book: this._id });
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = totalRating / reviews.length;
  } else {
    this.rating = 5;
  }
  await this.save();
};

module.exports = mongoose.model("Book", bookSchema);
