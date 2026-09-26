const express = require("express");
const router = express.Router();

const Borrowing = require("../models/Borrowing");
const Book = require("../models/Book");
const Member = require("../models/Member");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET ALL BORROWINGS
// GET /api/borrowings
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const borrowings = await Borrowing.find()
      .populate("bookId")
      .sort({ createdAt: -1 });

    res.json({
      count: borrowings.length,
      borrowings
    });
  } catch (error) {
    console.error("Get borrowings error:", error);

    res.status(500).json({
      message: "Failed to fetch borrowings",
      error: error.message
    });
  }
});

// ==========================================
// GET BORROWINGS BY MEMBER
// GET /api/borrowings/member/:memberId
// ==========================================

router.get(
  "/member/:memberId",
  authMiddleware,
  async (req, res) => {
    try {
      const { memberId } = req.params;

      console.log("Requested Member ID:", memberId);

      const member = await Member.findOne({
        memberId: memberId
      });

      if (!member) {
        return res.status(404).json({
          message: "Member not found",
          borrowings: []
        });
      }

      console.log(
        "Found Member:",
        member.memberId,
        member.name
      );

      const borrowings = await Borrowing.find({
        memberId: member.memberId
      })
        .populate("bookId")
        .sort({ createdAt: -1 });

      console.log(
        "Borrowings Found:",
        borrowings.length
      );

      res.json({
        member: {
          _id: member._id,
          memberId: member.memberId,
          name: member.name,
          email: member.email
        },
        count: borrowings.length,
        borrowings
      });
    } catch (error) {
      console.error(
        "Get member borrowings error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch member borrowings",
        error: error.message
      });
    }
  }
);

// ==========================================
// GET SINGLE BORROWING
// GET /api/borrowings/:id
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const borrowing =
        await Borrowing.findById(
          req.params.id
        ).populate("bookId");

      if (!borrowing) {
        return res.status(404).json({
          message: "Borrowing record not found"
        });
      }

      res.json({
        borrowing
      });
    } catch (error) {
      console.error(
        "Get borrowing error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch borrowing",
        error: error.message
      });
    }
  }
);

// ==========================================
// ISSUE BOOK
// POST /api/borrowings/issue
// ==========================================

router.post(
  "/issue",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        memberId,
        bookId,
        issueDate,
        dueDate
      } = req.body;

      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        !memberId ||
        !bookId ||
        !dueDate
      ) {
        return res.status(400).json({
          message:
            "memberId, bookId and dueDate are required"
        });
      }

      // ==========================================
      // FIND MEMBER
      // ==========================================

      const member =
        await Member.findOne({
          memberId
        });

      if (!member) {
        return res.status(404).json({
          message: "Member not found"
        });
      }

      if (member.status !== "active") {
        return res.status(400).json({
          message: "Member is inactive"
        });
      }

      // ==========================================
      // FIND BOOK
      // ==========================================

      const book =
        await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({
          message: "Book not found"
        });
      }

      if (book.status !== "active") {
        return res.status(400).json({
          message: "Book is inactive"
        });
      }

      if (book.availableCopies <= 0) {
        return res.status(400).json({
          message: "Book is unavailable"
        });
      }

      // ==========================================
      // CHECK EXISTING BORROWING
      // ==========================================

      const existingBorrowing =
        await Borrowing.findOne({
          memberId,
          bookId,
          status: {
            $in: [
              "Borrowed",
              "Overdue"
            ]
          }
        });

      if (existingBorrowing) {
        return res.status(400).json({
          message:
            "This member already has this book"
        });
      }

      // ==========================================
      // GENERATE TRANSACTION ID
      // ==========================================

      const lastBorrowing =
        await Borrowing.findOne()
          .sort({
            createdAt: -1
          });

      let transactionNumber = 1;

      if (
        lastBorrowing &&
        lastBorrowing.transactionId
      ) {
        const number =
          parseInt(
            lastBorrowing.transactionId.replace(
              "TRN",
              ""
            ),
            10
          );

        if (!isNaN(number)) {
          transactionNumber =
            number + 1;
        }
      }

      const transactionId =
        `TRN${String(
          transactionNumber
        ).padStart(4, "0")}`;

      // ==========================================
      // SAVE OLD AVAILABLE COPIES
      // ==========================================

      const oldAvailableCopies =
        book.availableCopies;

      // ==========================================
      // DECREASE AVAILABLE COPIES
      // ==========================================

      book.availableCopies =
        oldAvailableCopies - 1;

      await book.save();

      console.log(
        "Book:",
        book.title
      );

      console.log(
        "Available copies:",
        oldAvailableCopies,
        "->",
        book.availableCopies
      );

      // ==========================================
      // CREATE BORROWING
      // ==========================================

      let borrowing;

      try {
        borrowing =
          await Borrowing.create({
            transactionId,
            bookId,
            memberId,
            issueDate:
              issueDate ||
              new Date(),
            dueDate,
            returnDate: null,
            status: "Borrowed",
            fineAmount: 0
          });
      } catch (error) {
        // ==========================================
        // RESTORE COPY IF CREATION FAILS
        // ==========================================

        book.availableCopies =
          oldAvailableCopies;

        await book.save();

        throw error;
      }

      // ==========================================
      // GET UPDATED RESULT
      // ==========================================

      const result =
        await Borrowing.findById(
          borrowing._id
        ).populate("bookId");

      console.log(
        "Issue successful:",
        transactionId
      );

      console.log(
        "Final available copies:",
        book.availableCopies
      );

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      return res.status(201).json({
        success: true,
        message:
          "Book issued successfully",
        borrowing: result
      });

    } catch (error) {
      console.error(
        "Issue book error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to issue book",
        error: error.message
      });
    }
  }
);

// ==========================================
// RETURN BOOK
// POST /api/borrowings/:id/return
// ==========================================

router.post(
  "/:id/return",
  authMiddleware,
  async (req, res) => {
    try {
      const borrowing =
        await Borrowing.findById(
          req.params.id
        );

      if (!borrowing) {
        return res.status(404).json({
          message:
            "Borrowing record not found"
        });
      }

      if (
        borrowing.status ===
        "Returned"
      ) {
        return res.status(400).json({
          message:
            "Book has already been returned"
        });
      }

      // ==========================================
      // FIND BOOK
      // ==========================================

      const book =
        await Book.findById(
          borrowing.bookId
        );

      if (!book) {
        return res.status(404).json({
          message:
            "Book not found"
        });
      }

      // ==========================================
      // CALCULATE FINE
      // ₹5 PER OVERDUE DAY
      // ==========================================

      const returnDate =
        new Date();

      const dueDate =
        new Date(
          borrowing.dueDate
        );

      let fineAmount = 0;

      if (
        returnDate >
        dueDate
      ) {
        const difference =
          returnDate.getTime() -
          dueDate.getTime();

        const overdueDays =
          Math.ceil(
            difference /
              (1000 *
                60 *
                60 *
                24)
          );

        fineAmount =
          overdueDays * 5;
      }

      // ==========================================
      // UPDATE BORROWING
      // ==========================================

      borrowing.returnDate =
        returnDate;

      borrowing.fineAmount =
        fineAmount;

      borrowing.status =
        "Returned";

      await borrowing.save();

      // ==========================================
      // INCREASE AVAILABLE COPIES
      // ==========================================

      book.availableCopies =
        book.availableCopies + 1;

      if (
        book.availableCopies >
        book.totalCopies
      ) {
        book.availableCopies =
          book.totalCopies;
      }

      await book.save();

      console.log(
        "Book returned:",
        book.title
      );

      console.log(
        "Available copies after return:",
        book.availableCopies
      );

      // ==========================================
      // GET UPDATED RESULT
      // ==========================================

      const result =
        await Borrowing.findById(
          borrowing._id
        ).populate("bookId");

      return res.json({
        success: true,
        message:
          "Book returned successfully",
        fineAmount,
        borrowing: result
      });

    } catch (error) {
      console.error(
        "Return book error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to return book",
        error: error.message
      });
    }
  }
);

// ==========================================
// CHECK OVERDUE BORROWINGS
// PUT /api/borrowings/check-overdue
// ==========================================

router.put(
  "/check-overdue",
  authMiddleware,
  async (req, res) => {
    try {
      const today =
        new Date();

      const result =
        await Borrowing.updateMany(
          {
            status: "Borrowed",
            dueDate: {
              $lt: today
            }
          },
          {
            $set: {
              status: "Overdue"
            }
          }
        );

      res.json({
        message:
          "Overdue status updated successfully",
        modifiedCount:
          result.modifiedCount
      });

    } catch (error) {
      console.error(
        "Check overdue error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update overdue status",
        error: error.message
      });
    }
  }
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;