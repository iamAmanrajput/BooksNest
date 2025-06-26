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

    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

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

    const pendingReturn = await BorrowRecord.findOne({
      userId,
      bookId,
      status: "return_requested",
    });
    if (pendingReturn) {
      return res.status(400).json({
        success: false,
        message:
          "You’ve already requested a return for this book. Please wait until it's approved before making another request.",
      });
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
        message: `Unfortunately, your borrow request for '${book.title}' has been rejected.`,
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
          message: `Good news! Your request for '${book.title}' has been approved, and the book has been issued to you.`,
        }),
        User.findByIdAndUpdate(record.userId._id, {
          $push: { borrowedRecords: record._id },
        }),
      ]);

      mailSender(
        record.userId.email,
        `🎉 Great news! You've been issued the book: "${book.title}"`,
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
      message: `You've been added to the waitlist for '${bookTitle}'. Your current position in the queue is ${queuePosition}.`,
    });

    await mailSender(
      record.userId.email,
      "You've been added to the book queue",
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
      return res.status(404).json({
        success: false,
        message: "We couldn't find a valid borrow record for this request.",
      });
    }

    if (record.status === "return_requested") {
      return res.status(400).json({
        success: false,
        message:
          "You’ve already submitted a return request for this book. Please wait for admin approval.",
      });
    }

    if (["returned", "rejected"].includes(record.status)) {
      return res.status(400).json({
        success: false,
        message:
          "This book has already been returned or the request was rejected earlier.",
      });
    }

    if (record.status !== "issued") {
      return res.status(400).json({
        success: false,
        message:
          "You cannot request a return for this record in its current status.",
      });
    }

    record.status = "return_requested";
    await record.save();

    res.json({ success: true, message: "Return request sent to admin." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(400).json({
        success: false,
        message:
          "This book has not been marked for return or has already been processed.",
      });
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

    await Promise.all([
      record.save(),
      mailSender(
        record.userId.email,
        "✅ Return Confirmed: Your Book Has Been Successfully Returned",
        returnConfirmationEmail(
          record.userId.fullName,
          record.bookId.title,
          fine
        )
      ).catch((err) => console.error("Return confirmation mail failed", err)),
    ]);

    await book.save();

    if (fine > 0) {
      await Promise.all([
        User.findByIdAndUpdate(record.userId, {
          $inc: { fineAmount: fine },
        }),
        Notification.create({
          user: record.userId,
          type: "fine_alert",
          title: "Late Return Fine Applied",
          message: `You returned '${book.title}' after the due date. A fine of ₹${fine} has been added to your account.`,
        }),
        mailSender(
          record.userId.email,
          "📢 Late Return Fine: Please Settle Your Dues",
          fineAlertEmail(record.userId.fullName, record.bookId.title, fine)
        ).catch((err) => console.error("Fine alert mail failed", err)),
      ]);
    }

    // Handle Queue
    const queue = await BookQueue.findOne({ book: book._id });
    if (queue && queue.queue.length > 0) {
      const nextUser = queue.queue.shift();

      // Reset positions of remaining users
      queue.queue.forEach((entry, index) => {
        entry.position = index + 1;
      });

      await queue.save();

      // Try to find the queued BorrowRecord and update it
      const queuedRecord = await BorrowRecord.findOne({
        userId: nextUser.user,
        bookId: book._id,
        status: "queued",
      });

      let issuedRecord;

      if (queuedRecord) {
        queuedRecord.status = "issued";
        queuedRecord.issueDate = new Date();
        queuedRecord.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        issuedRecord = await queuedRecord.save();
      } else {
        // fallback: create new record
        issuedRecord = await BorrowRecord.create({
          userId: nextUser.user,
          bookId: book._id,
          status: "issued",
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }

      book.availableQuantity--;

      const user = await User.findById(nextUser.user);
      user.borrowedRecords.push(issuedRecord._id);

      await Promise.all([
        book.save(),
        user.save(),
        Notification.create({
          user: nextUser.user,
          type: "queue_notification",
          title: "📘 Book Issued from Queue",
          message: `Great news! The book '${book.title}' is now available and has been issued to you as per your queue request.`,
        }),
        mailSender(
          user.email,
          "Book Available",
          commonEmailTemplate(
            `Hello ${user.fullName},<br><br>We're happy to inform you that the book <b>${book.title}</b> has become available and has been automatically issued to you from the queue. Please check your dashboard for more details.`
          )
        ).catch((err) => console.error("Queue mail failed", err)),
      ]);
    }

    return res
      .status(200)
      .json({ success: true, message: "Book return processed successfully." });
  } catch (error) {
    console.error("Error in handleReturnRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
        message: "We couldn't find a valid borrow record for this request.",
      });
    }

    if (record.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "This book is not currently issued and cannot be renewed.",
      });
    }

    if (record.renewCount >= 2) {
      return res.status(400).json({
        success: false,
        message:
          "Renewal limit reached. You cannot renew this book any further.",
      });
    }

    const queue = await BookQueue.findOne({ book: record.bookId._id });

    // If queue exists and has users, renewal not allowed
    if (queue && queue.queue && queue.queue.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This book cannot be renewed because other users are waiting in the queue.",
      });
    }

    // Fine Calculation + Early Renew Block
    const today = new Date();
    const due = new Date(record.dueDate);

    // Prevent early renewals
    if (today <= due) {
      return res.status(400).json({
        success: false,
        message: "You can only renew this book after its due date has passed.",
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
          title: "Overdue Fine Applied",
          message: `Your book '${record.bookId.title}' was returned late. A fine of ₹${fine} has been added to your account.`,
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
        "📚 Book Renewal Successful",
        commonEmailTemplate(
          `Hello ${record.userId.fullName},<br><br>Your book <b>${
            record.bookId.title
          }</b> has been successfully renewed. Your new due date is <b>${newDueDate.toDateString()}</b>. Please return or renew it before the due date to avoid fines.`
        )
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "Book renewed successfully. Please check your updated due date.",
    });
  } catch (error) {
    console.error("Renew Book Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get BorrowHistory
const PER_DAY_FINE = 5;
exports.getBorrowHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    let query = { userId };

    // Overdue logic
    if (status === "overdue") {
      query.status = "issued";
      query.dueDate = { $lt: new Date() };
    } else if (status) {
      query.status = status;
    }

    const [totalRecord, borrowRecords] = await Promise.all([
      BorrowRecord.countDocuments(query),
      BorrowRecord.find(query)
        .populate({ path: "bookId", select: "title authors coverImage" })
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 }),
    ]);

    // Add Queue Position & Fine Calculation
    for (let i = 0; i < borrowRecords.length; i++) {
      const record = borrowRecords[i];

      // Queue Position
      if (record.status === "queued") {
        const bookQueue = await BookQueue.findOne({ book: record.bookId });
        const userEntry = bookQueue?.queue.find(
          (q) => q.user.toString() === userId.toString()
        );
        record._doc.queuePosition = userEntry?.position || null;
      }

      // Fine Calculation for overdue
      if (
        record.status === "issued" &&
        record.dueDate &&
        record.dueDate < new Date()
      ) {
        const overdueDays = Math.floor(
          (new Date() - new Date(record.dueDate)) / (1000 * 60 * 60 * 24)
        );
        const calculatedFine = overdueDays * PER_DAY_FINE;
        record._doc.fine = calculatedFine;
      }
    }

    return res.status(200).json({
      success: true,
      data: borrowRecords,
      pagination: {
        totalRecord,
        currentPage: page,
        totalPages: Math.ceil(totalRecord / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrow history",
      error: error.message,
    });
  }
};
