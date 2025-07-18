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
    if (!bookExists || bookExists.isDeleted) {
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

    // 1. Find borrow record and populate user and book
    const record = await BorrowRecord.findById(requestId).populate(
      "userId bookId"
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "We couldn't find a valid borrow record for this request.",
      });
    }

    // 2. Check if book is issued
    if (record.status !== "issued") {
      return res.status(400).json({
        success: false,
        message: "This book is not currently issued and cannot be renewed.",
      });
    }

    // 3. Check renew limit
    if (record.renewCount >= 2) {
      return res.status(400).json({
        success: false,
        message:
          "Renewal limit reached. You cannot renew this book any further.",
      });
    }

    // 4. Check if any queue exists for the book
    const queue = await BookQueue.findOne({ book: record.bookId._id });
    if (queue?.queue?.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This book cannot be renewed because other users are waiting in the queue.",
      });
    }

    // 5. Calculate fine
    const today = new Date();
    const previousDueDate = new Date(record.dueDate);
    let fine = 0;

    if (today > previousDueDate) {
      const lateDays = Math.ceil(
        (today - previousDueDate) / (1000 * 60 * 60 * 24)
      );
      fine = lateDays * 5;
      record.fine = (record.fine || 0) + fine;

      // Update user's fine and send fine notification
      await Promise.all([
        User.findByIdAndUpdate(record.userId._id, {
          $inc: { fineAmount: fine },
        }),
        Notification.create({
          user: record.userId._id,
          type: "fine_alert",
          title: "Overdue Fine Applied",
          message: `Your book '${record.bookId.title}' was overdue. A fine of ₹${fine} has been added to your account.`,
        }),
      ]);
    }

    // 6. Update renewal count and extend due date by 7 days
    record.renewCount += 1;
    record.lastRenewedAt = new Date();

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 7);
    record.dueDate = newDueDate;

    // 7. Save record and send email
    await Promise.all([
      record.save(),
      mailSender(
        record.userId.email,
        "📚 Book Renewal Successful",
        commonEmailTemplate(
          `Hello ${record.userId.fullName},<br><br>Your book <b>${
            record.bookId.title
          }</b> has been successfully renewed. Your new due date is <b>${newDueDate.toDateString()}</b>.<br><br>Please return or renew it before the due date to avoid fines.`
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

// issue book using email --Admin
exports.issueBookUsingEmail = async (req, res) => {
  try {
    let { bookId, email } = req.body;

    if (!email?.trim() || !bookId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const checkingRecord = await BorrowRecord.findOne({
      bookId,
      userId: user._id,
      status: {
        $in: ["pending", "issued", "return_requested", "queued"],
      },
    });

    if (checkingRecord) {
      const statusMessages = {
        pending: "User has already requested to borrow this book.",
        issued: "This book is already issued to the user.",
        return_requested:
          "Return request is already pending for this book. Please wait before requesting again.",
        queued: "User is already in the queue for this book.",
      };

      return res.status(400).json({
        success: false,
        message: statusMessages[checkingRecord.status] || "Invalid status",
      });
    }

    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Book not available
    if (book.availableQuantity <= 0) {
      let existingQueue = await BookQueue.findOne({ book: book._id });

      if (!existingQueue) {
        existingQueue = await BookQueue.create({ book: book._id, queue: [] });
      }

      const alreadyInQueue = existingQueue.queue.find(
        (entry) => entry.user.toString() === user._id.toString()
      );

      if (alreadyInQueue) {
        return res.status(400).json({
          success: false,
          message: "User is already in the queue for this book.",
        });
      }

      const position = existingQueue.queue.length + 1;
      existingQueue.queue.push({ user: user._id, position });

      await Promise.all([
        existingQueue.save(),
        Notification.create({
          user: user._id,
          type: "queue_notification",
          title: "Added to Queue",
          message: `You have been added to the queue for '${book.title}'. Your current position is ${position}.`,
        }),
        mailSender(
          user.email,
          "Added to Book Queue",
          addQueueEmailTemplate(user.fullName, book.title, position)
        ),
      ]);

      return res.status(200).json({
        success: true,
        message: `User added to the queue. Current position: ${position}.`,
      });
    }

    // Book is available
    book.availableQuantity--;

    await Promise.all([
      book.save(),
      BorrowRecord.create({
        userId: user._id,
        bookId: book._id,
        status: "issued",
        issueDate: Date.now(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }),
      Notification.create({
        user: user._id,
        type: "request_approved",
        title: "Book Issued",
        message: `'${book.title}' has been successfully issued to you by the admin.`,
      }),
      mailSender(
        user.email,
        "Book Issued Successfully",
        commonEmailTemplate(
          `Dear ${user.fullName},Your requested book '${
            book.title
          }' has been successfully issued.<br>Due Date:</b> ${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toLocaleDateString()}<br><br>Please make sure to return it before the due date.`
        )
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "Book issued successfully.",
    });
  } catch (error) {
    console.error("Issue book error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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

    // Build query
    const query = { userId };

    if (status === "overdue") {
      query.status = "issued";
      query.dueDate = { $lt: new Date() };
    } else if (status && status !== "all") {
      query.status = status;
    }

    // Fetch paginated records and total count
    const [totalRecord, borrowRecords] = await Promise.all([
      BorrowRecord.countDocuments(query),
      BorrowRecord.find(query)
        .populate({ path: "bookId", select: "title authors coverImage" })
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
    ]);

    const now = new Date();

    // Get all queued bookIds
    const queuedBookIds = borrowRecords
      .filter((record) => record.status === "queued" && record.bookId?._id)
      .map((record) => record.bookId._id.toString());

    let bookQueueMap = {};

    //  Bulk fetch all relevant book queues
    if (queuedBookIds.length > 0) {
      const bookQueues = await BookQueue.find({
        book: { $in: queuedBookIds },
      }).lean();

      // Convert to map
      bookQueues.forEach((queueDoc) => {
        bookQueueMap[queueDoc.book.toString()] = queueDoc.queue;
      });
    }

    // Add fine and queuePosition to each record
    const enhancedRecords = borrowRecords.map((record) => {
      // Clone record
      const updatedRecord = { ...record };

      // Fine Calculation
      if (
        updatedRecord.status === "issued" &&
        updatedRecord.dueDate &&
        new Date(updatedRecord.dueDate) < now
      ) {
        const overdueDays = Math.floor(
          (now - new Date(updatedRecord.dueDate)) / (1000 * 60 * 60 * 24)
        );
        updatedRecord.fine = overdueDays * PER_DAY_FINE;
        updatedRecord.status = "overdue";
      }

      // Queue Position Calculation
      if (updatedRecord.status === "queued" && updatedRecord.bookId?._id) {
        const queue = bookQueueMap[updatedRecord.bookId._id.toString()] || [];
        const userEntry = queue.find(
          (entry) => entry.user.toString() === userId.toString()
        );
        updatedRecord.queuePosition = userEntry?.position || null;
      }

      return updatedRecord;
    });

    // Step 6: Return final response
    return res.status(200).json({
      success: true,
      data: enhancedRecords,
      pagination: {
        totalRecord,
        currentPage: page,
        totalPages: Math.ceil(totalRecord / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error in getBorrowHistory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch borrow history",
      error: error.message,
    });
  }
};

// get Requests stats
exports.getRequestStats = async (req, res) => {
  try {
    const [pendingRequests, returnRequests] = await Promise.all([
      BorrowRecord.countDocuments({ status: "pending" }),
      BorrowRecord.countDocuments({ status: "return_requested" }),
    ]);
    return res
      .status(200)
      .json({ success: true, data: { pendingRequests, returnRequests } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//  get Requests Data
exports.fetchRequestData = async (req, res) => {
  try {
    let { email = "", status = "pending", page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const matchStage = {
      status,
    };

    if (email.trim()) {
      matchStage["user.email"] = {
        $regex: email.trim().toLowerCase(),
        $options: "i",
      };
    }

    const records = await BorrowRecord.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $addFields: {
          fullName: "$user.fullName",
          email: "$user.email",
          profilePic: "$user.profilePic",
          title: "$book.title",
          authors: "$book.authors",
        },
      },
      {
        $match: matchStage,
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          profilePic: 1,
          title: 1,
          authors: 1,
          status: 1,
          issueDate: 1,
          dueDate: 1,
          returnDate: 1,
          fine: 1,
          renewCount: 1,
          lastRenewedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const data = records[0]?.data || [];
    const total = records[0]?.metadata[0]?.total || 0;

    // Overdue fine calculation
    const enrichedRecords = data.map((doc) => {
      if (doc.dueDate) {
        const today = new Date();
        const due = new Date(doc.dueDate);
        const diffMs = today - due;

        const overdueDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (overdueDays > 0) {
          doc.overdueDays = overdueDays;
          doc.calculatedFine = overdueDays * PER_DAY_FINE;
        }
      }
      return doc;
    });

    return res.status(200).json({
      success: true,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
      data: enrichedRecords,
    });
  } catch (error) {
    console.error("Error in fetchRequestData:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
