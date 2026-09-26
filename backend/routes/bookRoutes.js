const express = require("express");
const router = express.Router();

const Book = require("../models/Book");

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  next();
};

// ==========================================
// ADD BOOK
// POST /api/books
// ==========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      isbn,
      title,
      author,
      category,
      publisher,
      publicationYear,
      description,
      totalCopies,
      availableCopies,
      location,
    } = req.body;

    // Required fields
    if (!isbn || !title || !author || !category) {
      return res.status(400).json({
        success: false,
        message:
          "ISBN, title, author and category are required",
      });
    }

    // Check duplicate ISBN
    const existingBook = await Book.findOne({
      isbn: isbn.trim(),
    });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message:
          "Book with this ISBN already exists",
      });
    }

    // Convert copies to numbers
    const copies = Number(totalCopies);
    const available = Number(availableCopies);

    // Validate total copies
    if (isNaN(copies) || copies < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Total copies must be a valid number",
      });
    }

    // Validate available copies
    if (isNaN(available) || available < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Available copies must be a valid number",
      });
    }

    // Available cannot exceed total
    if (available > copies) {
      return res.status(400).json({
        success: false,
        message:
          "Available copies cannot be greater than total copies",
      });
    }

    // Create new book
    const book = new Book({
      isbn: isbn.trim(),
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),

      publisher: publisher
        ? publisher.trim()
        : "",

      publicationYear:
        publicationYear !== undefined &&
        publicationYear !== ""
          ? Number(publicationYear)
          : undefined,

      description: description
        ? description.trim()
        : "",

      totalCopies: copies,
      availableCopies: available,

      location: location
        ? location.trim()
        : "",

      status: "active",
    });

    // Save book
    await book.save();

    console.log(
      "Book added successfully:",
      book.title,
      book._id
    );

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    console.error(
      "ADD BOOK ERROR:",
      error
    );

    // Duplicate ISBN error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Book with this ISBN already exists",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(
        error.errors
      ).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // Other server errors
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to add book",
    });
  }
});

// ==========================================
// GET ALL BOOKS
// GET /api/books
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      category,
      available,
      search,
    } = req.query;

    let filter = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Available filter
    if (available === "true") {
      filter.availableCopies = {
        $gt: 0,
      };
    }

    // Search
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
        {
          isbn: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const books = await Book.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      count: books.length,
      books,
    });
  } catch (error) {
    console.error(
      "GET BOOKS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE BOOK
// GET /api/books/:id
// ==========================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      book,
    });
  } catch (error) {
    console.error(
      "GET SINGLE BOOK ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE BOOK
// PUT /api/books/:id
// ==========================================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      isbn,
      title,
      author,
      category,
      publisher,
      publicationYear,
      description,
      totalCopies,
      location,
    } = req.body;

    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Check duplicate ISBN
    if (isbn && isbn !== book.isbn) {
      const duplicate = await Book.findOne({
        isbn,
        _id: {
          $ne: book._id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          message:
            "Another book already uses this ISBN",
        });
      }

      book.isbn = isbn;
    }

    if (title !== undefined) {
      book.title = title;
    }

    if (author !== undefined) {
      book.author = author;
    }

    if (category !== undefined) {
      book.category = category;
    }

    if (publisher !== undefined) {
      book.publisher = publisher;
    }

    if (publicationYear !== undefined) {
      book.publicationYear =
        publicationYear;
    }

    if (description !== undefined) {
      book.description = description;
    }

    if (location !== undefined) {
      book.location = location;
    }

    // Update total copies
    if (totalCopies !== undefined) {
      const newTotal = Number(totalCopies);

      if (newTotal < 0) {
        return res.status(400).json({
          message:
            "Total copies cannot be negative",
        });
      }

      const issuedCopies =
        book.totalCopies -
        book.availableCopies;

      if (newTotal < issuedCopies) {
        return res.status(400).json({
          message:
            "Total copies cannot be less than currently issued copies",
        });
      }

      book.totalCopies = newTotal;

      book.availableCopies =
        newTotal - issuedCopies;
    }

    await book.save();

    res.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error(
      "UPDATE BOOK ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update book",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE BOOK
// DELETE /api/books/:id
// ==========================================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const issuedCopies =
      book.totalCopies -
      book.availableCopies;

    if (issuedCopies > 0) {
      return res.status(400).json({
        message:
          "Cannot delete a book while copies are issued",
      });
    }

    await Book.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE BOOK ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
});

// ==========================================
// ISSUE BOOK
// POST /api/books/:id/issue
// ==========================================

router.post("/:id/issue", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        message: "No copies available",
      });
    }

    book.availableCopies -= 1;

    await book.save();

    res.json({
      success: true,
      message: "Book issued successfully",
      book,
    });
  } catch (error) {
    console.error(
      "ISSUE BOOK ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to issue book",
      error: error.message,
    });
  }
});

// ==========================================
// RETURN BOOK
// POST /api/books/:id/return
// ==========================================

router.post("/:id/return", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(
      req.params.id
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (
      book.availableCopies >=
      book.totalCopies
    ) {
      return res.status(400).json({
        message:
          "All copies are already available",
      });
    }

    book.availableCopies += 1;

    await book.save();

    res.json({
      success: true,
      message:
        "Book returned successfully",
      book,
    });
  } catch (error) {
    console.error(
      "RETURN BOOK ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to return book",
      error: error.message,
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;