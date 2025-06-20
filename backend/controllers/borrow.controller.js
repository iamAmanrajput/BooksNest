const BorrowRecord = require("../models/borrowRecord.model");
const Book = require("../models/book.model");
const BookQueue = require("../models/bookQueue.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const mailSender = require("../utils/mailSender");
const { commonEmailTemplate } = require("../templates/commonEmailTemplate");
const { addQueueEmailTemplate } = require("../templates/addQueueEmailTemplate");
const { fineAlertEmail } = require("../templates/finealertEmailTemplate");
const {
  returnConfirmationEmail,
} = require("../templates/returnBookEmailTemplate");

// send Borrow Request
exports.sendBorrowRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;

    const existing = await BorrowRecord.findOne({
      userId,
      bookId,
      status: "pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Request already sent" });
    }

    const alreadyIssued = await BorrowRecord.findOne({
      userId,
      bookId,
      status: "issued",
    });
    if (alreadyIssued) {
      return res
        .status(400)
        .json({ success: false, message: "Book already issued" });
    }

    const alreadyQueued = await BorrowRecord.findOne({
      userId,
      bookId,
      status: "queued",
    });
    if (alreadyQueued) {
      return res.status(400).json({
        success: false,
        message: "You are already in the queue for this book.",
      });
    }

    const request = await BorrowRecord.create({ userId, bookId });

    return res.status(201).json({
      success: true,
      message: "Request sent to admin, please wait for approval.",
    });
  } catch (error) {
    console.error("Error in sendBorrowRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// handle Borrow Request -- Admin
exports.handleBorrowRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;

    const record = await BorrowRecord.findById(requestId).populate(
      "userId bookId"
    );

    if (!record || record.status !== "pending") {
      return res
        .status(404)
        .json({ success: false, message: "Invalid request." });
    }

    const book = record.bookId;

    // Rejection logic
    if (action === "rejected") {
      record.status = "rejected";
      await record.save();

      await Notification.create({
        user: record.userId._id,
        type: "request_rejected",
        title: "Request Rejected",
        message: `Your borrow request for '${book.title}' was rejected.`,
      });

      await mailSender(
        record.userId.email,
        `Borrow request for '${book.title}' was rejected.`,
        commonEmailTemplate(
          `Your borrow request for ${book.title} was rejected.`
        )
      );

      return res.json({ success: true, message: "Request rejected." });
    }

    // Issue book if available
    if (book.availableQuantity > 0) {
      record.status = "issued";
      record.issueDate = new Date();
      record.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      book.availableQuantity--;

      await Promise.all([
        record.save(),
        book.save(),
        Notification.create({
          user: record.userId._id,
          type: "request_approved",
          title: "Book Issued",
          message: `Your request for ${book.title} has been accepted and issued.`,
        }),
        User.findByIdAndUpdate(record.userId._id, {
          $push: { borrowedRecords: record._id },
        }),
      ]);

      mailSender(
        record.userId.email,
        `🎉 You’ve been assigned the book: "${book.title}"`,
        commonEmailTemplate(
          `Your request for ${book.title} has been accepted and issued.`
        )
      ).catch((err) => console.error("Email sending failed:", err));

      return res.status(200).json({ success: true, message: "Book issued." });
    }

    // Add to queue if not available
    let queue = await BookQueue.findOne({ book: book._id });
    if (!queue) {
      queue = await BookQueue.create({ book: book._id, queue: [] });
    }

    let userPosition;
    const alreadyInQueue = queue.queue.find(
      (item) => item.user.toString() === record.userId._id.toString()
    );

    if (!alreadyInQueue) {
      userPosition = queue.queue.length + 1;
      queue.queue.push({ user: record.userId._id, position: userPosition });
      await queue.save();

      record.status = "queued";
      await record.save();
    } else {
      userPosition = alreadyInQueue.position;
    }

    // Safe values with fallbacks
    const userName = record?.userId?.fullName || "User";
    const bookTitle = book?.title || "Book";
    const queuePosition = userPosition || "N/A";

    await Notification.create({
      user: record.userId._id,
      type: "queue_notification",
      title: "Added to Queue",
      message: `You’ve been added to the queue for ${bookTitle}. Your position is ${queuePosition}.`,
    });

    await mailSender(
      record.userId.email,
      `You are added in the Queue`,
      addQueueEmailTemplate(userName, bookTitle, queuePosition)
    ).catch((err) => console.error("Queue Email Error:", err));

    return res.status(200).json({ success: true, message: "Added to queue." });
  } catch (error) {
    console.error("Error in handleBorrowRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// send Return Request
exports.sendReturnRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const record = await BorrowRecord.findById(requestId);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Borrow record not found." });
    }

    if (record.status === "return_requested") {
      return res
        .status(400)
        .json({ success: false, message: "Return request already sent." });
    }

    if (["returned", "rejected"].includes(record.status)) {
      return res.status(400).json({
        success: false,
        message: "Book already returned or request was rejected.",
      });
    }

    if (record.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "Cannot request return for this record.",
      });
    }

    record.status = "return_requested";
    await record.save();

    res.json({ success: true, message: "Return request sent to admin." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book Return and Auto-issue to next in queue --Admin
exports.handleReturnRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const record = await BorrowRecord.findById(requestId).populate(
      "userId bookId"
    );

    if (!record || record.status !== "return_requested") {
      return res.status(400).json({ message: "Return not requested." });
    }

    const today = new Date();
    const due = record.dueDate;

    let fine = 0;
    if (today > due) {
      const lateDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
      fine = lateDays * 5; // ₹5 per day
    }

    record.status = "returned";
    record.returnDate = today;
    record.fine = fine;

    const book = await Book.findById(record.bookId);
    book.availableQuantity++;

    // Send confirmation email & save record in parallel
    await Promise.all([
      record.save(),
      mailSender(
        record.userId.email,
        "📚 Your Book Has Been Successfully Returned",
        returnConfirmationEmail(
          record.userId.fullName,
          record.bookId.title,
          fine
        )
      ),
    ]);

    await book.save();

    // If fine exists, notify and email in parallel
    if (fine > 0) {
      await Promise.all([
        User.findByIdAndUpdate(record.userId, {
          $inc: { fineAmount: fine },
        }),
        Notification.create({
          user: record.userId,
          type: "fine_alert",
          title: "Fine Incurred",
          message: `You returned '${book.title}' late. ₹${fine} has been added as fine.`,
        }),
        mailSender(
          record.userId.email,
          "Fine Alert: Please Clear Your Dues for Returned Book",
          fineAlertEmail(record.userId.fullName, record.bookId.title, fine)
        ),
      ]);
    }

    // Check queue
    const queue = await BookQueue.findOne({ book: book._id });
    if (queue && queue.queue.length > 0) {
      const nextUser = queue.queue.shift();

      // Reassign correct positions
      queue.queue.forEach((entry, index) => {
        entry.position = index + 1;
      });

      const newRecord = await BorrowRecord.create({
        userId: nextUser.user,
        bookId: book._id,
        status: "issued",
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      book.availableQuantity--;

      const user = await User.findById(nextUser.user);
      user.borrowedRecords.push(newRecord._id);

      await Promise.all([
        queue.save(),
        book.save(),
        user.save(),
        Notification.create({
          user: nextUser.user,
          type: "queue_notification",
          title: "Book Now Available",
          message: `The book '${book.title}' is now available and has been issued to you.`,
        }),
        mailSender(
          user.email,
          "Book Available",
          commonEmailTemplate(
            `Hello ${user.fullName}, The book <b>${book.title}</b> is now available and has been issued to you.`
          )
        ),
      ]);
    }

    return res.status(200).json({ success: true, message: "Return accepted." });
  } catch (error) {
    console.error("Error in acceptReturn:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Renew Book
exports.renewBook = async (req, res) => {
  try {
    const { requestId } = req.params;

    const record = await BorrowRecord.findById(requestId).populate(
      "userId bookId"
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    if (record.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "Book is not issued",
      });
    }

    if (record.renewCount >= 2) {
      return res.status(400).json({
        success: false,
        message: "You have reached the maximum renew limit",
      });
    }

    const queue = await BookQueue.findOne({ book: record.bookId._id });

    // If queue exists and has users, renewal not allowed
    if (queue && queue.queue && queue.queue.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available for renewal as it is in queue",
      });
    }

    // Fine Calculation + Early Renew Block
    const today = new Date();
    const due = new Date(record.dueDate);

    // Prevent early renewals
    if (today <= due) {
      return res.status(400).json({
        success: false,
        message: "You can only renew the book after the due date has passed.",
      });
    }

    // Fine calculation
    let fine = 0;
    const lateDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    fine = lateDays * 5;
    record.fine = (record.fine || 0) + fine;

    // Update user fineAmount and send fine notification
    if (fine > 0) {
      await Promise.all([
        User.findByIdAndUpdate(record.userId._id, {
          $inc: { fineAmount: fine },
        }),
        Notification.create({
          user: record.userId._id,
          type: "fine_alert",
          title: "Fine Incurred",
          message: `Your book '${record.bookId.title}' is overdue. A fine of ₹${fine} has been added to your account.`,
        }),
      ]);
    }

    // Renew the book
    record.renewCount += 1;
    record.lastRenewedAt = new Date();

    // Extend due date by 7 days
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 7);
    record.dueDate = newDueDate;

    await Promise.all([
      record.save(),
      mailSender(
        record.userId.email,
        "Successfully Renewed the Book",
        commonEmailTemplate(
          `Your book '${
            record.bookId.title
          }' has been renewed successfully. New due date is ${newDueDate.toDateString()}.`
        )
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "Book renewed successfully",
    });
  } catch (error) {
    console.error("Renew Book Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
