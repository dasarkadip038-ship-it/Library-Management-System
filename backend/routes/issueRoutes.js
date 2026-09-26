const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const Book = require("../models/Book");
const Member = require("../models/Member");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// ISSUE A BOOK
// POST /api/issues
// =====================================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      memberId,
      bookId,
      dueDate
    } = req.body;

    // Check required fields
    if (!memberId || !bookId || !dueDate) {
      return res.status(400).json({
        message: "memberId, bookId and dueDate are required"
      });
    }

    // Check member
    const member = await Member.findOne({ memberId });

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    if (member.status !== "active") {
      return res.status(400).json({
        message: "Member is not active"
      });
    }

    // Check book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // Check book status
    if (book.status !== "active") {
      return res.status(400).json({
        message: "Book is inactive"
      });
    }

    // Check available copies
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "No available copies of this book"
      });
    }

    // Check if same member already has this book
    const existingIssue = await Issue.findOne({
      memberId,
      bookId,
      status: {
        $in: ["issued", "overdue"]
      }
    });

    if (existingIssue) {
      return res.status(400).json({
        message: "This member already has this book issued"
      });
    }

    // Generate Issue ID
    const lastIssue = await Issue.findOne()
      .sort({ createdAt: -1 });

    let issueNumber = 1;

    if (lastIssue && lastIssue.issueId) {
      const number = parseInt(
        lastIssue.issueId.replace("ISS", ""),
        10
      );

      if (!isNaN(number)) {
        issueNumber = number + 1;
      }
    }

    const issueId = `ISS${String(issueNumber).padStart(3, "0")}`;

    // Create issue
    const issue = await Issue.create({
      issueId,
      memberId,
      bookId,
      dueDate,
      status: "issued",
      fine: 0
    });

    // Decrease available copies
    book.availableCopies -= 1;

    await book.save();

    // Populate book information
    const populatedIssue = await Issue.findById(issue._id)
      .populate("bookId");

    res.status(201).json({
      message: "Book issued successfully",
      issue: populatedIssue
    });

  } catch (error) {
    console.error("Issue book error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// GET ALL ISSUES
// GET /api/issues
// =====================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("bookId")
      .sort({ createdAt: -1 });

    res.json({
      count: issues.length,
      issues
    });

  } catch (error) {
    console.error("Get issues error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// GET SINGLE ISSUE
// GET /api/issues/:id
// =====================================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("bookId");

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found"
      });
    }

    res.json({
      issue
    });

  } catch (error) {
    console.error("Get issue error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// GET MEMBER'S ISSUES
// GET /api/issues/member/:memberId
// =====================================================
router.get(
  "/member/:memberId",
  authMiddleware,
  async (req, res) => {
    try {
      const issues = await Issue.find({
        memberId: req.params.memberId
      })
        .populate("bookId")
        .sort({ createdAt: -1 });

      res.json({
        memberId: req.params.memberId,
        count: issues.length,
        issues
      });

    } catch (error) {
      console.error("Get member issues error:", error);

      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


// =====================================================
// GET ACTIVE ISSUES
// GET /api/issues/active
// =====================================================
router.get("/status/active", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find({
      status: {
        $in: ["issued", "overdue"]
      }
    })
      .populate("bookId")
      .sort({ dueDate: 1 });

    res.json({
      count: issues.length,
      issues
    });

  } catch (error) {
    console.error("Get active issues error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================================
// UPDATE OVERDUE STATUS
// PUT /api/issues/check-overdue
// =====================================================
router.put(
  "/check-overdue",
  authMiddleware,
  async (req, res) => {
    try {
      const today = new Date();

      const result = await Issue.updateMany(
        {
          status: "issued",
          dueDate: {
            $lt: today
          }
        },
        {
          $set: {
            status: "overdue"
          }
        }
      );

      res.json({
        message: "Overdue status updated successfully",
        modifiedCount: result.modifiedCount
      });

    } catch (error) {
      console.error("Check overdue error:", error);

      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


// =====================================================
// RETURN BOOK
// PUT /api/issues/return/:id
// =====================================================
router.put(
  "/return/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const issue = await Issue.findById(req.params.id);

      if (!issue) {
        return res.status(404).json({
          message: "Issue record not found"
        });
      }

      // Already returned
      if (issue.status === "returned") {
        return res.status(400).json({
          message: "Book has already been returned"
        });
      }

      // Find book
      const book = await Book.findById(issue.bookId);

      if (!book) {
        return res.status(404).json({
          message: "Book not found"
        });
      }

      const returnDate = new Date();

      // Calculate fine
      let fine = 0;

      const dueDate = new Date(issue.dueDate);

      if (returnDate > dueDate) {
        const difference =
          returnDate.getTime() - dueDate.getTime();

        const overdueDays = Math.ceil(
          difference / (1000 * 60 * 60 * 24)
        );

        // ₹5 fine per overdue day
        fine = overdueDays * 5;
      }

      // Update issue
      issue.returnDate = returnDate;
      issue.fine = fine;
      issue.status = "returned";

      await issue.save();

      // Increase available copies
      book.availableCopies += 1;

      // Don't allow available copies
      // to exceed total copies
      if (book.availableCopies > book.totalCopies) {
        book.availableCopies = book.totalCopies;
      }

      await book.save();

      const updatedIssue = await Issue.findById(issue._id)
        .populate("bookId");

      res.json({
        message: "Book returned successfully",
        fine,
        issue: updatedIssue
      });

    } catch (error) {
      console.error("Return book error:", error);

      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


// =====================================================
// DELETE ISSUE RECORD
// DELETE /api/issues/:id
// =====================================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue record not found"
      });
    }

    // Don't delete an active issue
    if (
      issue.status === "issued" ||
      issue.status === "overdue"
    ) {
      return res.status(400).json({
        message: "Cannot delete an active issue record"
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({
      message: "Issue record deleted successfully"
    });

  } catch (error) {
    console.error("Delete issue error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;