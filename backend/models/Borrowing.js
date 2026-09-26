const mongoose = require("mongoose");

const borrowingSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    memberId: {
      type: String,
      required: true,
      trim: true
    },

    issueDate: {
      type: Date,
      default: Date.now
    },

    dueDate: {
      type: Date,
      required: true
    },

    returnDate: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["Borrowed", "Returned", "Overdue"],
      default: "Borrowed"
    },

    fineAmount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    collection: "borrowings"
  }
);

module.exports = mongoose.model("Borrowing", borrowingSchema);