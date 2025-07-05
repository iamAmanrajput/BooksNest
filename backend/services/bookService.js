const BorrowRecord = require("../models/borrowRecord.model");

// Utility function to strip time (0:00:00) from date
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

//  Get books due in exactly 2 days
async function getBooksDueInTwoDays() {
  const today = new Date();
  const twoDaysLater = new Date(today);
  twoDaysLater.setDate(today.getDate() + 2);

  const start = getStartOfDay(twoDaysLater);
  const end = getEndOfDay(twoDaysLater);

  return await BorrowRecord.find({
    dueDate: { $gte: start, $lte: end },
    status: "issued",
  }).populate("userId bookId");
}

// Get overdue books (dueDate < today & not returned)
async function getOverdueBooks() {
  const today = getStartOfDay(new Date());

  return await BorrowRecord.find({
    dueDate: { $lt: today },
    status: "issued",
  }).populate("userId bookId");
}

module.exports = { getBooksDueInTwoDays, getOverdueBooks };
