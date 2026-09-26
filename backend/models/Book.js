const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    publisher: {
      type: String,
      trim: true,
      default: ""
    },

    publicationYear: {
      type: Number,
      min: 0
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },

    location: {
      type: String,
      trim: true,
      default: ""
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

// Validate before save
bookSchema.pre("save", function () {
  if (this.availableCopies > this.totalCopies) {
    throw new Error(
      "Available copies cannot exceed total copies"
    );
  }

  if (this.availableCopies < 0) {
    throw new Error(
      "Available copies cannot be negative"
    );
  }

  if (this.totalCopies < 0) {
    throw new Error(
      "Total copies cannot be negative"
    );
  }
});

module.exports = mongoose.model("Book", bookSchema);