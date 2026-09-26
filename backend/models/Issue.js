const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    memberId: {
      type: String,
      required: true,
      trim: true
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
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

    fine: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Issue", issueSchema);