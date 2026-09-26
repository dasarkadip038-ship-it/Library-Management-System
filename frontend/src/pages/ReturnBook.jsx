import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ReturnBook() {
  const [transactionId, setTransactionId] = useState("");
  const [borrowing, setBorrowing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const searchBorrowing = async () => {
    if (!transactionId.trim()) {
      setError("Please enter Transaction ID");
      setMessage("");
      setBorrowing(null);
      return;
    }

    try {
      setSearching(true);
      setError("");
      setMessage("");
      setBorrowing(null);

      const response = await API.get("/borrowings");

      const borrowings =
        response.data.borrowings || response.data || [];

      const found = borrowings.find(
        (item) =>
          (item.transactionId || item.issueId || "")
            .toLowerCase() ===
          transactionId.trim().toLowerCase()
      );

      if (!found) {
        setError("Borrowing transaction not found");
        return;
      }

      setBorrowing(found);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to search borrowing transaction"
      );
    } finally {
      setSearching(false);
    }
  };

  const handleReturn = async () => {
    if (!borrowing) return;

    if (
      borrowing.status === "returned" ||
      borrowing.status === "Returned"
    ) {
      setError("Book has already been returned");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post(
        `/borrowings/${borrowing._id}/return`
      );

      setMessage("Book returned successfully");

      setBorrowing({
        ...borrowing,
        status: "returned",
        returnDate: new Date().toISOString(),
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to return book"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isReturned =
    borrowing?.status === "returned" ||
    borrowing?.status === "Returned";

  const fine =
    borrowing?.fineAmount ??
    borrowing?.fine ??
    0;

  return (
    <div style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <div style={styles.brand}>
              📚 Library Management System
            </div>

            <h1 style={styles.title}>
              Return Book
            </h1>

            <p style={styles.subtitle}>
              Search a borrowing transaction and process
              the book return.
            </p>
          </div>

          <Link
            to="/dashboard"
            style={styles.dashboardButton}
          >
            ← Dashboard
          </Link>
        </div>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <Link to="/dashboard" style={styles.navLink}>
            🏠 Dashboard
          </Link>

          <span style={styles.separator}>›</span>

          <Link to="/borrowings" style={styles.navLink}>
            📖 Borrowings
          </Link>

          <span style={styles.separator}>›</span>

          <span style={styles.currentNav}>
            ↩ Return Book
          </span>
        </div>

        {/* SEARCH CARD */}
        <div style={styles.searchCard}>

          <div style={styles.searchHeader}>
            <div style={styles.searchIcon}>
              🔎
            </div>

            <div>
              <h2 style={styles.cardTitle}>
                Find Borrowing Transaction
              </h2>

              <p style={styles.cardSubtitle}>
                Enter the transaction ID to view borrowing
                details.
              </p>
            </div>
          </div>

          <div style={styles.searchRow}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                #
              </span>

              <input
                type="text"
                value={transactionId}
                onChange={(e) => {
                  setTransactionId(e.target.value);
                  setError("");
                  setMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchBorrowing();
                  }
                }}
                placeholder="Enter Transaction ID e.g. TRN0001"
                style={styles.input}
              />
            </div>

            <button
              type="button"
              onClick={searchBorrowing}
              disabled={searching}
              style={{
                ...styles.searchButton,
                opacity: searching ? 0.7 : 1,
                cursor: searching
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {searching ? (
                <>↻ Searching...</>
              ) : (
                <>🔎 Search Transaction</>
              )}
            </button>
          </div>

          <p style={styles.searchHint}>
            Enter the exact Transaction ID associated with
            the borrowed book.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>
              !
            </div>

            <div>
              <strong>
                Unable to process request
              </strong>

              <p style={styles.messageText}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>
              ✓
            </div>

            <div>
              <strong>
                Return Successful
              </strong>

              <p style={styles.messageText}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* BORROWING DETAILS */}
        {borrowing && (
          <div style={styles.detailsCard}>

            <div style={styles.detailsHeader}>
              <div>
                <h2 style={styles.detailsTitle}>
                  Borrowing Details
                </h2>

                <p style={styles.detailsSubtitle}>
                  Review the transaction before returning
                  the book.
                </p>
              </div>

              <span
                style={{
                  ...styles.statusBadge,
                  background: isReturned
                    ? "#ecfdf5"
                    : "#fff7ed",
                  color: isReturned
                    ? "#15803d"
                    : "#c2410c",
                  borderColor: isReturned
                    ? "#bbf7d0"
                    : "#fed7aa",
                }}
              >
                {isReturned
                  ? "✓ Returned"
                  : "● Active Borrowing"}
              </span>
            </div>

            {/* BOOK HIGHLIGHT */}
            <div style={styles.bookHighlight}>
              <div style={styles.bookIcon}>
                📖
              </div>

              <div style={styles.bookInfo}>
                <span style={styles.smallLabel}>
                  BOOK
                </span>

                <h3 style={styles.bookTitle}>
                  {borrowing.bookId?.title ||
                    borrowing.book?.title ||
                    "-"}
                </h3>

                {(borrowing.bookId?.author ||
                  borrowing.book?.author) && (
                  <p style={styles.author}>
                    by{" "}
                    {borrowing.bookId?.author ||
                      borrowing.book?.author}
                  </p>
                )}
              </div>
            </div>

            {/* DETAILS GRID */}
            <div style={styles.detailsGrid}>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Transaction ID
                </span>

                <strong style={styles.transactionValue}>
                  {borrowing.transactionId ||
                    borrowing.issueId ||
                    "-"}
                </strong>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Member ID
                </span>

                <strong style={styles.detailValue}>
                  {borrowing.memberId || "-"}
                </strong>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Issue Date
                </span>

                <strong style={styles.detailValue}>
                  {formatDate(
                    borrowing.issueDate
                  )}
                </strong>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Due Date
                </span>

                <strong
                  style={{
                    ...styles.detailValue,
                    color: "#b91c1c",
                  }}
                >
                  {formatDate(
                    borrowing.dueDate
                  )}
                </strong>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Return Date
                </span>

                <strong style={styles.detailValue}>
                  {formatDate(
                    borrowing.returnDate
                  )}
                </strong>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>
                  Current Status
                </span>

                <strong
                  style={{
                    ...styles.detailValue,
                    color: isReturned
                      ? "#15803d"
                      : "#c2410c",
                    textTransform: "capitalize",
                  }}
                >
                  {borrowing.status || "-"}
                </strong>
              </div>

            </div>

            {/* FINE */}
            <div style={styles.fineCard}>
              <div style={styles.fineIcon}>
                ₹
              </div>

              <div>
                <span style={styles.fineLabel}>
                  Outstanding Fine
                </span>

                <strong style={styles.fineValue}>
                  ₹{fine}
                </strong>
              </div>
            </div>

            {/* ACTION */}
            <div style={styles.returnSection}>

              {isReturned ? (
                <div style={styles.alreadyReturned}>
                  <span style={styles.checkCircle}>
                    ✓
                  </span>

                  <div>
                    <strong>
                      Book Already Returned
                    </strong>

                    <p>
                      This transaction has already been
                      completed.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={styles.returnAction}>
                  <div>
                    <h3 style={styles.actionTitle}>
                      Ready to Return?
                    </h3>

                    <p style={styles.actionText}>
                      Confirm the return of this book to
                      update the library records.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReturn}
                    disabled={loading}
                    style={{
                      ...styles.returnButton,
                      opacity: loading ? 0.7 : 1,
                      cursor: loading
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {loading
                      ? "↻ Returning..."
                      : "↩ Return Book"}
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* EMPTY STATE */}
        {!borrowing &&
          !searching &&
          !error && (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                ↩
              </div>

              <h3 style={styles.emptyTitle}>
                Search for a Transaction
              </h3>

              <p style={styles.emptyText}>
                Enter a Transaction ID above to view
                borrowing information and return the book.
              </p>

              <Link
                to="/borrowings"
                style={styles.viewButton}
              >
                View All Borrowings
              </Link>

            </div>
          )}

        {/* FOOTER */}
        <div style={styles.footerActions}>
          <Link
            to="/borrowings"
            style={styles.secondaryButton}
          >
            ← All Borrowings
          </Link>

          <Link
            to="/overdue"
            style={styles.warningButton}
          >
            ⚠ Overdue Books
          </Link>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    padding: "35px 25px",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#172033",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  glowOne: {
    position: "fixed",
    width: "370px",
    height: "370px",
    borderRadius: "50%",
    background:
      "rgba(99,102,241,0.08)",
    filter: "blur(90px)",
    top: "-120px",
    right: "-90px",
  },

  glowTwo: {
    position: "fixed",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background:
      "rgba(16,185,129,0.06)",
    filter: "blur(85px)",
    bottom: "-100px",
    left: "-90px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  brand: {
    color: "#4f46e5",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    marginBottom: "9px",
  },

  title: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "850",
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },

  dashboardButton: {
    textDecoration: "none",
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "12px 18px",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "750",
    boxShadow:
      "0 6px 18px rgba(15,23,42,0.05)",
  },

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 17px",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid #e2e8f0",
    borderRadius: "13px",
    marginBottom: "20px",
    backdropFilter: "blur(10px)",
    flexWrap: "wrap",
  },

  navLink: {
    textDecoration: "none",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "750",
  },

  separator: {
    color: "#94a3b8",
  },

  currentNav: {
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "800",
  },

  searchCard: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow:
      "0 12px 35px rgba(15,23,42,0.06)",
  },

  searchHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  },

  searchIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  searchRow: {
    display: "flex",
    gap: "12px",
    alignItems: "stretch",
  },

  inputWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    overflow: "hidden",
  },

  inputIcon: {
    paddingLeft: "14px",
    color: "#6366f1",
    fontWeight: "900",
    fontSize: "16px",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "13px 14px 13px 9px",
    fontSize: "14px",
    color: "#172033",
  },

  searchButton: {
    border: "none",
    borderRadius: "11px",
    padding: "0 20px",
    background:
      "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.2)",
  },

  searchHint: {
    margin: "10px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#991b1b",
    padding: "15px 18px",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  errorIcon: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#dc2626",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "15px 18px",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  successIcon: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#16a34a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  messageText: {
    margin: "4px 0 0",
    fontSize: "12px",
  },

  detailsCard: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #e2e8f0",
    borderRadius: "21px",
    overflow: "hidden",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.07)",
  },

  detailsHeader: {
    padding: "22px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  detailsTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "850",
  },

  detailsSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  statusBadge: {
    border: "1px solid",
    padding: "8px 11px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
  },

  bookHighlight: {
    margin: "22px 24px",
    padding: "20px",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg, #eef2ff, #f8fafc)",
    border: "1px solid #e0e7ff",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  bookIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#4f46e5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    flexShrink: 0,
    boxShadow:
      "0 8px 18px rgba(79,70,229,0.2)",
  },

  bookInfo: {
    minWidth: 0,
  },

  smallLabel: {
    display: "block",
    color: "#818cf8",
    fontSize: "9px",
    fontWeight: "850",
    letterSpacing: "1px",
    marginBottom: "5px",
  },

  bookTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "850",
    color: "#1e293b",
  },

  author: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
    padding: "0 24px 22px",
  },

  detailItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "13px",
    padding: "14px",
  },

  detailLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "850",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "6px",
  },

  detailValue: {
    fontSize: "13px",
    color: "#334155",
  },

  transactionValue: {
    color: "#4f46e5",
    fontSize: "13px",
  },

  fineCard: {
    margin: "0 24px 22px",
    padding: "17px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  fineIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#f97316",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "900",
  },

  fineLabel: {
    display: "block",
    color: "#9a3412",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  fineValue: {
    display: "block",
    color: "#c2410c",
    fontSize: "21px",
    marginTop: "3px",
  },

  returnSection: {
    borderTop: "1px solid #e2e8f0",
    padding: "20px 24px",
    background: "#fafafa",
  },

  returnAction: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  actionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "800",
  },

  actionText: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  returnButton: {
    border: "none",
    borderRadius: "11px",
    padding: "13px 20px",
    background:
      "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    boxShadow:
      "0 8px 20px rgba(22,163,74,0.2)",
  },

  alreadyReturned: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    color: "#166534",
  },

  checkCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    color: "#16a34a",
  },

  emptyState: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "65px 25px",
    textAlign: "center",
    boxShadow:
      "0 12px 35px rgba(15,23,42,0.05)",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    margin: "0 auto 17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
  },

  emptyText: {
    maxWidth: "480px",
    margin: "8px auto 20px",
    color: "#64748b",
    fontSize: "13px",
  },

  viewButton: {
    display: "inline-block",
    textDecoration: "none",
    background: "#4f46e5",
    color: "#fff",
    padding: "11px 17px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "750",
  },

  footerActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  secondaryButton: {
    textDecoration: "none",
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "11px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "750",
  },

  warningButton: {
    textDecoration: "none",
    background: "#fff7ed",
    color: "#c2410c",
    border: "1px solid #fed7aa",
    padding: "11px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "750",
  },
};

export default ReturnBook;