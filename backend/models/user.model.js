const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    profilePic: {
      publicId: {
        type: String,
      },
      imageUrl: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profileLastUpdated: {
      type: Date,
      default: Date.now,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpire: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    verificationToken: {
      type: String,
      default: null,
      select: false,
    },
    verificationTokenExpire: {
      type: Date,
      default: null,
      select: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// update the field profileLastUpdated
userSchema.pre("save", function (next) {
  if (
    this.isModified("fullName") ||
    this.isModified("email") ||
    this.isModified("gender") ||
    this.isModified("profilePic") ||
    this.isModified("password")
  ) {
    this.profileLastUpdated = new Date();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
