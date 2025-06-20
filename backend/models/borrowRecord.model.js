const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "issued",
        "returned",
        "return_requested",
        "rejected",
        "queued",
      ],
      default: "pending",
    },
    issueDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    returnDate: {
      type: Date,
    },
    fine: {
      type: Number,
      default: 0,
    },
    renewCount: {
      type: Number,
      default: 0,
      max: 2,
    },
    lastRenewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);
