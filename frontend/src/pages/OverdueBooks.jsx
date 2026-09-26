import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function OverdueBooks() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverdueBooks = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setMessage("");

      // First update overdue status
      await API.put("/borrowings/check-overdue");

      // Then get all borrowings
      const response = await API.get("/borrowings");

      const allBorrowings = response.data.borrowings || [];

      const overdue = allBorrowings.filter(
        (item) => String(item.status).toLowerCase() === "overdue"
      );

      setBorrowings(overdue);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load overdue books"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  const totalFine = borrowings.reduce(
    (sum, item) =>
      sum + Number(item.fineAmount ?? item.fine ?? 0),
    0
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;

    const due = new Date(dueDate);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = today - due;

    return Math.max(
      0,
      Math.ceil(difference / (1000 * 60 * 60 * 24))
    );
  };

  return (
    <div style={styles.page}>
      {/* Background Decoration */}
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
              Overdue Books
            </h1>

            <p style={styles.subtitle}>
              Track books that have passed their due date
              and monitor outstanding fines.
            </p>
          </div>

          <button
            onClick={fetchOverdueBooks}
            disabled={refreshing}
            style={{
              ...styles.refreshButton,
              opacity: refreshing ? 0.7 : 1,
              cursor: refreshing
                ? "not-allowed"
                : "pointer",
            }}
          >
            {refreshing ? "↻ Checking..." : "↻ Refresh"}
          </button>
        </div>

        {/* NAVIGATION */}
        <div style={styles.navigation}>
          <Link to="/dashboard" style={styles.navLink}>
            🏠 Dashboard
          </Link>

          <span style={styles.separator}>›</span>

          <Link to="/borrowings" style={styles.navLink}>
            📖 Borrowings
          </Link>

          <span style={styles.separator}>›</span>

          <span style={styles.currentNav}>
            ⚠️ Overdue
          </span>
        </div>

        {/* ERROR MESSAGE */}
        {message && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>!</span>

            <div>
              <strong>Unable to load overdue books</strong>
              <p style={styles.errorText}>
                {message}
              </p>
            </div>

            <button
              onClick={fetchOverdueBooks}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#fff1f2",
              }}
            >
              ⚠️
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Overdue
              </p>

              <h2 style={styles.statValue}>
                {borrowings.length}
              </h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#fff7ed",
              }}
            >
              💰
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Fine
              </p>

              <h2 style={styles.statValue}>
                ₹{totalFine}
              </h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: "#fef2f2",
              }}
            >
              ⏰
            </div>

            <div>
              <p style={styles.statLabel}>
                Pending Returns
              </p>

              <h2 style={styles.statValue}>
                {borrowings.length}
              </h2>
            </div>
          </div>

        </div>

        {/* MAIN CARD */}
        <div style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Overdue Transactions
              </h2>

              <p style={styles.cardSubtitle}>
                Books currently marked as overdue
              </p>
            </div>

            <div style={styles.countBadge}>
              {borrowings.length} Records
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>

              <p style={styles.loadingText}>
                Checking overdue books...
              </p>
            </div>
          ) : borrowings.length === 0 ? (

            /* EMPTY STATE */
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                ✓
              </div>

              <h3 style={styles.emptyTitle}>
                No Overdue Books
              </h3>

              <p style={styles.emptyText}>
                Great! There are currently no overdue
                books in the library.
              </p>

              <Link
                to="/borrowings"
                style={styles.emptyButton}
              >
                View All Borrowings
              </Link>

            </div>

          ) : (

            /* TABLE */
            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>
                    <th style={styles.th}>
                      Transaction
                    </th>

                    <th style={styles.th}>
                      Member
                    </th>

                    <th style={styles.th}>
                      Book
                    </th>

                    <th style={styles.th}>
                      Issue Date
                    </th>

                    <th style={styles.th}>
                      Due Date
                    </th>

                    <th style={styles.th}>
                      Overdue
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th
                      style={{
                        ...styles.th,
                        textAlign: "right",
                      }}
                    >
                      Fine
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {borrowings.map((item) => {

                    const daysOverdue =
                      getDaysOverdue(item.dueDate);

                    return (
                      <tr
                        key={item._id}
                        style={styles.tr}
                      >

                        {/* TRANSACTION */}
                        <td style={styles.td}>
                          <span style={styles.transactionId}>
                            {item.transactionId ||
                              item.issueId ||
                              "-"}
                          </span>
                        </td>

                        {/* MEMBER */}
                        <td style={styles.td}>
                          <span style={styles.memberBadge}>
                            {item.memberId || "-"}
                          </span>
                        </td>

                        {/* BOOK */}
                        <td style={styles.td}>
                          <div>
                            <div style={styles.bookTitle}>
                              {item.bookId?.title ||
                                item.book?.title ||
                                "-"}
                            </div>

                            {(
                              item.bookId?.author ||
                              item.book?.author
                            ) && (
                              <div style={styles.author}>
                                {item.bookId?.author ||
                                  item.book?.author}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* ISSUE DATE */}
                        <td style={styles.td}>
                          {formatDate(item.issueDate)}
                        </td>

                        {/* DUE DATE */}
                        <td style={styles.td}>
                          <span style={styles.dueDate}>
                            {formatDate(item.dueDate)}
                          </span>
                        </td>

                        {/* DAYS OVERDUE */}
                        <td style={styles.td}>
                          <span style={styles.overdueBadge}>
                            {daysOverdue}{" "}
                            {daysOverdue === 1
                              ? "day"
                              : "days"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td style={styles.td}>
                          <span style={styles.statusBadge}>
                            ⚠ {item.status}
                          </span>
                        </td>

                        {/* FINE */}
                        <td
                          style={{
                            ...styles.td,
                            textAlign: "right",
                          }}
                        >
                          <span style={styles.fine}>
                            ₹
                            {item.fineAmount ??
                              item.fine ??
                              0}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div style={styles.bottomActions}>

          <Link
            to="/borrowings"
            style={styles.secondaryButton}
          >
            ← All Borrowings
          </Link>

          <Link
            to="/borrowings/return"
            style={styles.primaryButton}
          >
            ↩ Return Book
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
    maxWidth: "1450px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  glowOne: {
    position: "fixed",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "rgba(99, 102, 241, 0.08)",
    filter: "blur(80px)",
    top: "-120px",
    right: "-80px",
  },

  glowTwo: {
    position: "fixed",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "rgba(239, 68, 68, 0.06)",
    filter: "blur(80px)",
    bottom: "-100px",
    left: "-80px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "25px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  brand: {
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    marginBottom: "10px",
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

  refreshButton: {
    border: "none",
    borderRadius: "13px",
    padding: "13px 20px",
    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "750",
    boxShadow:
      "0 10px 25px rgba(220, 38, 38, 0.22)",
  },

  navigation: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 17px",
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "14px",
    marginBottom: "22px",
    backdropFilter: "blur(12px)",
  },

  navLink: {
    textDecoration: "none",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  },

  separator: {
    color: "#94a3b8",
  },

  currentNav: {
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "800",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#991b1b",
    padding: "15px 18px",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  errorIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#dc2626",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  errorText: {
    margin: "4px 0 0",
    fontSize: "13px",
  },

  retryButton: {
    marginLeft: "auto",
    border: "1px solid #fecdd3",
    background: "#fff",
    color: "#b91c1c",
    padding: "8px 14px",
    borderRadius: "9px",
    fontWeight: "700",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  statCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    margin: "4px 0 0",
    fontSize: "25px",
    fontWeight: "850",
  },

  card: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.07)",
  },

  cardHeader: {
    padding: "22px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  countBadge: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "800",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1050px",
  },

  th: {
    padding: "15px 18px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
  },

  td: {
    padding: "17px 18px",
    fontSize: "13px",
    color: "#334155",
    verticalAlign: "middle",
  },

  transactionId: {
    color: "#4f46e5",
    background: "#eef2ff",
    padding: "7px 9px",
    borderRadius: "8px",
    fontWeight: "800",
    fontSize: "12px",
  },

  memberBadge: {
    background: "#f1f5f9",
    color: "#334155",
    padding: "7px 9px",
    borderRadius: "8px",
    fontWeight: "750",
    fontSize: "12px",
  },

  bookTitle: {
    fontWeight: "750",
    color: "#172033",
    maxWidth: "250px",
  },

  author: {
    marginTop: "4px",
    fontSize: "11px",
    color: "#94a3b8",
  },

  dueDate: {
    color: "#b91c1c",
    fontWeight: "750",
  },

  overdueBadge: {
    display: "inline-block",
    background: "#fff7ed",
    color: "#c2410c",
    border: "1px solid #fed7aa",
    padding: "6px 9px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
  },

  statusBadge: {
    display: "inline-block",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "6px 9px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  fine: {
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: "850",
  },

  loadingBox: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
  },

  spinner: {
    width: "38px",
    height: "38px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #ef4444",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },

  loadingText: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "650",
  },

  emptyState: {
    padding: "70px 25px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#ecfdf5",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "900",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "800",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    margin: "8px auto 22px",
    maxWidth: "450px",
  },

  emptyButton: {
    display: "inline-block",
    textDecoration: "none",
    background: "#4f46e5",
    color: "#fff",
    padding: "11px 17px",
    borderRadius: "10px",
    fontWeight: "750",
    fontSize: "13px",
  },

  bottomActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  secondaryButton: {
    textDecoration: "none",
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "11px 17px",
    borderRadius: "10px",
    fontWeight: "750",
    fontSize: "13px",
  },

  primaryButton: {
    textDecoration: "none",
    background:
      "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    padding: "11px 17px",
    borderRadius: "10px",
    fontWeight: "750",
    fontSize: "13px",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.2)",
  },
};

export default OverdueBooks;