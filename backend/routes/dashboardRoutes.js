const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const Member = require("../models/Member");
const Borrowing = require("../models/Borrowing");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// DASHBOARD STATISTICS
// GET /api/dashboard/statistics
// ==========================================

router.get("/statistics", authMiddleware, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();

    const bookCopies = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: { $sum: "$totalCopies" },
          availableCopies: { $sum: "$availableCopies" }
        }
      }
    ]);

    const totalMembers = await Member.countDocuments();

    const activeMembers = await Member.countDocuments({
      status: "active"
    });

    // Count active borrowings from the correct collection.
    const issuedBooks = await Borrowing.countDocuments({
      status: { $in: ["Borrowed", "Overdue"] }
    });

    // Include overdue records that have not yet been
    // updated from Borrowed to Overdue.
    const overdueBooks = await Borrowing.countDocuments({
      $or: [
        { status: "Overdue" },
        {
          status: "Borrowed",
          dueDate: { $lt: new Date() }
        }
      ]
    });

    const fineResult = await Borrowing.aggregate([
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$fineAmount" }
        }
      }
    ]);

    res.json({
      statistics: {
        totalBooks,

        totalCopies:
          bookCopies.length > 0
            ? bookCopies[0].totalCopies
            : 0,

        availableCopies:
          bookCopies.length > 0
            ? bookCopies[0].availableCopies
            : 0,

        totalMembers,
        activeMembers,
        issuedBooks,
        overdueBooks,

        totalFine:
          fineResult.length > 0
            ? fineResult[0].totalFine
            : 0
      }
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
});

// ==========================================
// RECENT ACTIVITY
// GET /api/dashboard/recent-activity
// ==========================================

router.get("/recent-activity", authMiddleware, async (req, res) => {
  try {
    const recentIssues = await Borrowing.find()
      .populate("bookId")
      .sort({ createdAt: -1 })
      .limit(10);

    const recentBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const recentMembers = await Member.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      recentActivity: {
        issues: recentIssues,
        books: recentBooks,
        members: recentMembers
      }
    });
  } catch (error) {
    console.error("Recent activity error:", error);

    res.status(500).json({
      message: "Failed to fetch recent activity",
      error: error.message
    });
  }
});

module.exports = router;