const BorrowRecord = require("../models/borrowRecord.model");
const Book = require("../models/book.model");
const BookQueue = require("../models/bookQueue.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const mailSender = require("../utils/mailSender");
const { commonEmailTemplate } = require("../templates/commonEmailTemplate");
const { addQueueEmailTemplate } = require("../templates/addQueueEmailTemplate");

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
        .json({ success: false, message: "Book already Issued" });
    }
    const request = await BorrowRecord.create({ userId, bookId });
    return res.status(201).json({
      success: true,
      message: "Request Sent to admin, Please wait for approvel",
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
    const { requestId } = req.params; // id of borrowRecord Document
    const { action } = req.body;
    const record = await BorrowRecord.findById(requestId).populate(
      "bookId userId"
    );
    if (!record || record.status !== "pending") {
      return res
        .status(404)
        .json({ success: false, message: "Invalid request." });
    }

    // get book info
    const book = await Book.findById(record.bookId._id);

    // If action was rejected
    if (action === "rejected") {
      record.status = "rejected";
      await record.save();

      await Notification.create({
        user: record.userId._id,
        type: "request_rejected",
        title: "Request Rejected",
        message: `Your borrow request for '${book.title}' was rejected.`,
      });

      const emailResponse = await mailSender(
        record.userId.email,
        `Borrow request for '${book.title}' was rejected.`,
        commonEmailTemplate(
          "`Your borrow request for '${book.title}' was rejected.`"
        )
      );

      return res.json({ success: true, message: "Request rejected." });
    }

    // check available quantity and assign
    if (book.availableQuantity > 0) {
      record.status = "issued";
      record.issueDate = new Date();
      record.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      book.availableQuantity--;
      await record.save();
      await book.save();

      await Notification.create({
        user: record.userId._id,
        type: "request_approved",
        title: "Book Issued",
        message: `Your request for ${book.title} has been accepted and issued.`,
      });

      const emailResponse = await mailSender(
        record.userId.email,
        `🎉 You’ve been assigned the book: "${book.title}`,
        commonEmailTemplate(
          `Your request for ${book.title} has been accepted and issued.`
        )
      );

      await User.findByIdAndUpdate(record.userId._id, {
        $push: { borrowedRecords: record._id },
      });
      return res.status(200).json({ success: true, message: "Book issued." });
    } else {
      // if book is not availabe sent user to the queue
      // Add to queue
      let queue = await BookQueue.findOne({ book: book._id });
      if (!queue) {
        queue = await BookQueue.create({ book: book._id, queue: [] });
      }

      const alreadyInQueue = queue.queue.find(
        (item) => item.user.toString() === record.userId._id.toString()
      );

      if (!alreadyInQueue) {
        const position = queue.queue.length + 1;
        queue.queue.push({
          user: record.userId._id,
          position,
        });
        await queue.save();
      }

      await Notification.create({
        user: record.userId._id,
        type: "queue_notification",
        title: "Added to Queue",
        message: `You’ve been added to the queue for ${book.title}. Your position is ${position}.`,
      });

      await mailSender(
        record.userId.email,
        `You are added in the Queue`,
        addQueueEmailTemplate(record.userId.fullName, book.title, position)
      );

      return res
        .status(200)
        .json({ success: true, message: "Added to queue." });
    }
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
    const { recordId } = req.params;
    const record = await BorrowRecord.findById(recordId);

    if (!record || record.status !== "issued") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid borrow record." });
    }

    record.status = "return_requested";
    await record.save();

    res.json({ success: true, message: "Return request sent to admin." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Book Return and Auto-issue to next in queue --Admin
// Incomplete
exports.acceptReturn = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await BorrowRecord.findById(recordId);
    if (!record || record.status !== "return_requested") {
      return res.status(400).json({ message: "Return not requested." });
    }

    const today = new Date();
    const due = record.dueDate;

    let fine = 0;
    if (today > due) {
      const lateDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
      fine = lateDays * 10; // ₹10 per day
    }

    record.status = "returned";
    record.returnDate = today;
    record.fine = fine;
    await record.save();

    const book = await Book.findById(record.bookId);
    book.availableQuantity++;
    await book.save();

    if (fine > 0) {
      await User.findByIdAndUpdate(record.userId, {
        $inc: { fineAmount: fine },
      });
      await Notification.create({
        user: record.userId,
        type: "fine_alert",
        title: "Fine Incurred",
        message: `You returned '${book.title}' late. ₹${fine} has been added as fine.`,
      });
    }

    const queue = await BookQueue.findOne({ book: book._id });
    if (queue && queue.queue.length > 0) {
      const nextUser = queue.queue.shift();
      await queue.save();

      const newRecord = await BorrowRecord.create({
        userId: nextUser.user,
        bookId: book._id,
        status: "issued",
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });

      book.availableQuantity--;
      await book.save();

      const user = await User.findById(nextUser.user);

      await Notification.create({
        user: nextUser.user,
        type: "book_available",
        title: "Book Now Available",
        message: `The book '${book.title}' is now available and has been issued to you.`,
      });

      await sendMail({
        to: user.email,
        subject: "Book Available",
        html: `<p>Hello ${user.fullName},<br/>The book <b>${book.title}</b> is now available and has been issued to you.</p>`,
      });
    }

    res.json({ success: true, message: "Return accepted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
