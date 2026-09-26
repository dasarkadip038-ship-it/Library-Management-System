// ==========================================
// LIBRARY MANAGEMENT SYSTEM - SERVER
// ==========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const issueRoutes = require("./routes/issueRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const borrowingRoutes = require("./routes/borrowingRoutes");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// BASIC TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Library Management System API is running!"
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Books
app.use("/api/books", bookRoutes);

// Members
app.use("/api/members", memberRoutes);

// Old Issue / Return Routes
app.use("/api/issues", issueRoutes);

// Categories
app.use("/api/categories", categoryRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Borrowing - PDF Based API
app.use("/api/borrowings", borrowingRoutes);

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/library_management";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });

// ==========================================
// SERVER PORT
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});