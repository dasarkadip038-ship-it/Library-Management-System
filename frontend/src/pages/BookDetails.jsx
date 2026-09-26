import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Navigation from "../components/Navigation";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await API.get(`/books/${id}`);

      setBook(
        response.data.book || response.data
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load book details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  /* ===============================
     LOADING
  =============================== */

  if (loading) {
    return (
      <div style={styles.page}>
        <Navigation />

        <div style={styles.centerBox}>
          <div style={styles.loadingIcon}>
            📚
          </div>

          <h2>Loading Book Details...</h2>

          <p style={styles.mutedText}>
            Please wait while we load the book information.
          </p>
        </div>
      </div>
    );
  }

  /* ===============================
     ERROR
  =============================== */

  if (error) {
    return (
      <div style={styles.page}>
        <Navigation />

        <main style={styles.container}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>
              ⚠️
            </div>

            <h2>
              Unable to Load Book
            </h2>

            <p style={styles.errorText}>
              {error}
            </p>

            <div style={styles.buttonArea}>
              <button
                type="button"
                onClick={fetchBook}
                style={styles.primaryButton}
              >
                🔄 Try Again
              </button>

              <Link
                to="/books"
                style={styles.secondaryButton}
              >
                📚 Back to Books
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ===============================
     BOOK NOT FOUND
  =============================== */

  if (!book) {
    return (
      <div style={styles.page}>
        <Navigation />

        <main style={styles.container}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>
              🔍
            </div>

            <h2>
              Book Not Found
            </h2>

            <p style={styles.mutedText}>
              The requested book could not be found.
            </p>

            <Link
              to="/books"
              style={styles.secondaryButton}
            >
              📚 Back to Books
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ===============================
          NAVIGATION
      =============================== */}

      <Navigation />


      {/* ===============================
          HEADER
      =============================== */}

      <header style={styles.header}>

        <p style={styles.smallTitle}>
          LIBRARY COLLECTION
        </p>

        <h1 style={styles.title}>
          Book Details
        </h1>

        <p style={styles.subtitle}>
          View complete information about this book.
        </p>

      </header>


      {/* ===============================
          MAIN
      =============================== */}

      <main style={styles.container}>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div style={styles.successMessage}>
            ✅ {message}
          </div>
        )}


        {/* ===============================
            BOOK SUMMARY CARD
        =============================== */}

        <div style={styles.summaryCard}>

          <div style={styles.bookIcon}>
            📚
          </div>

          <div style={styles.summaryContent}>

            <p style={styles.categoryText}>
              {book.category || "General"}
            </p>

            <h2 style={styles.bookTitle}>
              {book.title || "-"}
            </h2>

            <p style={styles.authorText}>
              by {book.author || "Unknown Author"}
            </p>

            <div style={styles.statusRow}>

              <span
                style={{
                  ...styles.statusBadge,
                  background:
                    book.status === "active"
                      ? "#dcfce7"
                      : "#fee2e2",
                  color:
                    book.status === "active"
                      ? "#166534"
                      : "#991b1b",
                }}
              >
                ● {book.status || "unknown"}
              </span>

              <span style={styles.isbnBadge}>
                ISBN: {book.isbn || "-"}
              </span>

            </div>

          </div>

        </div>


        {/* ===============================
            INFORMATION CARD
        =============================== */}

        <div style={styles.infoCard}>

          <div style={styles.cardHeader}>

            <div>
              <p style={styles.sectionSmall}>
                BOOK INFORMATION
              </p>

              <h3 style={styles.cardTitle}>
                Complete Details
              </h3>
            </div>

            <div style={styles.cardIcon}>
              📖
            </div>

          </div>


          <div style={styles.detailsGrid}>

            <DetailItem
              label="ISBN"
              value={book.isbn}
            />

            <DetailItem
              label="Book Title"
              value={book.title}
            />

            <DetailItem
              label="Author"
              value={book.author}
            />

            <DetailItem
              label="Category"
              value={book.category}
            />

            <DetailItem
              label="Publisher"
              value={book.publisher}
            />

            <DetailItem
              label="Publication Year"
              value={book.publicationYear}
            />

            <DetailItem
              label="Total Copies"
              value={book.totalCopies ?? 0}
            />

            <DetailItem
              label="Available Copies"
              value={book.availableCopies ?? 0}
              highlight
            />

            <DetailItem
              label="Location"
              value={book.location}
            />

            <DetailItem
              label="Status"
              value={book.status}
            />

            <DetailItem
              label="Created At"
              value={
                book.createdAt
                  ? new Date(
                      book.createdAt
                    ).toLocaleString()
                  : "-"
              }
            />

            <DetailItem
              label="Updated At"
              value={
                book.updatedAt
                  ? new Date(
                      book.updatedAt
                    ).toLocaleString()
                  : "-"
              }
            />

          </div>


          {/* DESCRIPTION */}

          <div style={styles.descriptionBox}>

            <h4 style={styles.descriptionTitle}>
              Description
            </h4>

            <p style={styles.descriptionText}>
              {book.description ||
                "No description available for this book."}
            </p>

          </div>

        </div>


        {/* ===============================
            ACTION BUTTONS
        =============================== */}

        <div style={styles.actionCard}>

          <h3 style={styles.actionTitle}>
            Quick Actions
          </h3>

          <div style={styles.buttonArea}>

            <Link
              to={`/books/edit/${book._id}`}
              style={styles.primaryButton}
            >
              ✏️ Edit Book
            </Link>

            <Link
              to="/books"
              style={styles.secondaryButton}
            >
              📚 Back to Books
            </Link>

            <Link
              to="/dashboard"
              style={styles.dashboardButton}
            >
              🏠 Dashboard
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =================================================
   DETAIL COMPONENT
================================================= */

function DetailItem({
  label,
  value,
  highlight = false,
}) {
  return (
    <div style={styles.detailItem}>

      <span style={styles.detailLabel}>
        {label}
      </span>

      <strong
        style={{
          ...styles.detailValue,
          color: highlight
            ? "#15803d"
            : "#0f172a",
        }}
      >
        {value || "-"}
      </strong>

    </div>
  );
}


/* =================================================
   PREMIUM INLINE STYLES
================================================= */

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
    color: "#0f172a",
  },

  header: {
    textAlign: "center",
    padding: "40px 20px 25px",
  },

  smallTitle: {
    margin: 0,
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: "8px 0",
    fontSize: "34px",
    fontWeight: "850",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  container: {
    width: "92%",
    maxWidth: "1100px",
    margin: "0 auto",
    paddingBottom: "50px",
  },

  centerBox: {
    width: "90%",
    maxWidth: "500px",
    margin: "100px auto",
    padding: "45px",
    textAlign: "center",
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.08)",
  },

  loadingIcon: {
    fontSize: "45px",
  },

  mutedText: {
    color: "#64748b",
    fontSize: "14px",
  },

  errorCard: {
    marginTop: "60px",
    padding: "45px",
    background: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.08)",
  },

  errorIcon: {
    fontSize: "45px",
  },

  errorText: {
    color: "#dc2626",
    fontSize: "14px",
  },

  successMessage: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "11px",
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    fontWeight: "600",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
    padding: "28px",
    marginBottom: "20px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #111827, #312e81)",
    color: "#ffffff",
    boxShadow:
      "0 20px 45px rgba(30, 41, 59, 0.16)",
  },

  bookIcon: {
    minWidth: "75px",
    width: "75px",
    height: "75px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "35px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.15)",
  },

  summaryContent: {
    minWidth: 0,
  },

  categoryText: {
    margin: 0,
    color: "#c7d2fe",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },

  bookTitle: {
    margin: "7px 0",
    fontSize: "28px",
    fontWeight: "850",
  },

  authorText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
  },

  statusRow: {
    display: "flex",
    gap: "9px",
    flexWrap: "wrap",
    marginTop: "15px",
  },

  statusBadge: {
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  isbnBadge: {
    padding: "6px 11px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.1)",
    color: "#e2e8f0",
    fontSize: "11px",
  },

  infoCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow:
      "0 12px 35px rgba(15, 23, 42, 0.07)",
    border:
      "1px solid #e2e8f0",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "18px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  sectionSmall: {
    margin: 0,
    color: "#6366f1",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  cardTitle: {
    margin: "5px 0 0",
    fontSize: "22px",
    fontWeight: "800",
  },

  cardIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    fontSize: "22px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "14px",
  },

  detailItem: {
    padding: "16px",
    borderRadius: "12px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
  },

  detailLabel: {
    display: "block",
    marginBottom: "6px",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  detailValue: {
    fontSize: "14px",
    wordBreak: "break-word",
  },

  descriptionBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "13px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
  },

  descriptionTitle: {
    margin: "0 0 8px",
    fontSize: "14px",
  },

  descriptionText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.7",
  },

  actionCard: {
    marginTop: "20px",
    padding: "22px",
    borderRadius: "18px",
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.05)",
  },

  actionTitle: {
    margin: "0 0 15px",
    fontSize: "16px",
  },

  buttonArea: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  primaryButton: {
    display: "inline-block",
    textDecoration: "none",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow:
      "0 8px 18px rgba(79, 70, 229, 0.2)",
  },

  secondaryButton: {
    display: "inline-block",
    textDecoration: "none",
    border: "1px solid #cbd5e1",
    padding: "11px 19px",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  dashboardButton: {
    display: "inline-block",
    textDecoration: "none",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default BookDetails;