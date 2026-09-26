import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      setMessage("");

      await API.put("/borrowings/check-overdue");

      const response = await API.get("/borrowings");

      setBorrowings(response.data.borrowings || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load borrowings"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const returnBook = async (id) => {
    try {
      setMessage("");

      const response = await API.post(
        `/borrowings/${id}/return`
      );

      setMessage(
        `Book returned successfully. Fine: ₹${
          response.data.fine || 0
        }`
      );

      setMessageType("success");

      fetchBorrowings();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to return book"
      );
      setMessageType("error");
    }
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "returned") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "overdue") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1e40af",
    };
  };

  const activeCount = borrowings.filter(
    (item) => {
      const status = String(
        item.status || ""
      ).toLowerCase();

      return (
        status === "borrowed" ||
        status === "issued"
      );
    }
  ).length;

  const returnedCount = borrowings.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "returned"
  ).length;

  const overdueCount = borrowings.filter(
    (item) =>
      String(item.status || "").toLowerCase() ===
      "overdue"
  ).length;

  const totalFine = borrowings.reduce(
    (total, item) =>
      total +
      Number(
        item.fineAmount ??
          item.fine ??
          0
      ),
    0
  );

  return (
    <div style={styles.page}>

      {/* =====================================
          HEADER
      ===================================== */}

      <header style={styles.header}>

        <div style={styles.brandArea}>

          <div style={styles.logo}>
            📚
          </div>

          <div>
            <h1 style={styles.brandTitle}>
              Library Management System
            </h1>

            <p style={styles.brandSubtitle}>
              Borrowing & Return Management
            </p>
          </div>

        </div>

        <div style={styles.headerActions}>

          <Link
            to="/dashboard"
            style={styles.dashboardButton}
          >
            ← Dashboard
          </Link>

          <Link
            to="/borrowings/history"
            style={styles.historyButton}
          >
            📜 History
          </Link>

        </div>

      </header>


      {/* =====================================
          MAIN
      ===================================== */}

      <main style={styles.container}>

        {/* HERO */}

        <section style={styles.hero}>

          <div>

            <p style={styles.smallTitle}>
              LIBRARY TRANSACTIONS
            </p>

            <h2 style={styles.pageTitle}>
              Borrowings Management
            </h2>

            <p style={styles.description}>
              Manage issued books, returns, due dates
              and overdue transactions.
            </p>

          </div>

          <div style={styles.heroActions}>

            <button
              type="button"
              onClick={fetchBorrowings}
              style={styles.refreshButton}
            >
              ↻ Refresh
            </button>

            <Link
              to="/borrowings/issue"
              style={styles.issueButton}
            >
              + Issue New Book
            </Link>

          </div>

        </section>


        {/* MESSAGE */}

        {message && (
          <div
            style={{
              ...styles.messageBox,
              background:
                messageType === "error"
                  ? "#fef2f2"
                  : "#f0fdf4",
              color:
                messageType === "error"
                  ? "#991b1b"
                  : "#166534",
              borderColor:
                messageType === "error"
                  ? "#fecaca"
                  : "#bbf7d0",
            }}
          >
            {messageType === "error"
              ? "⚠️"
              : "✅"}{" "}
            {message}
          </div>
        )}


        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <section style={styles.summaryGrid}>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#eef2ff",
              }}
            >
              📋
            </div>

            <div>
              <p style={styles.summaryLabel}>
                Total Borrowings
              </p>

              <h3 style={styles.summaryValue}>
                {borrowings.length}
              </h3>
            </div>
          </div>


          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#dbeafe",
              }}
            >
              📖
            </div>

            <div>
              <p style={styles.summaryLabel}>
                Active
              </p>

              <h3 style={styles.summaryValue}>
                {activeCount}
              </h3>
            </div>
          </div>


          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#dcfce7",
              }}
            >
              ✅
            </div>

            <div>
              <p style={styles.summaryLabel}>
                Returned
              </p>

              <h3 style={styles.summaryValue}>
                {returnedCount}
              </h3>
            </div>
          </div>


          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#fee2e2",
              }}
            >
              ⚠️
            </div>

            <div>
              <p style={styles.summaryLabel}>
                Overdue
              </p>

              <h3 style={styles.summaryValue}>
                {overdueCount}
              </h3>
            </div>
          </div>


          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#fefce8",
              }}
            >
              💰
            </div>

            <div>
              <p style={styles.summaryLabel}>
                Total Fine
              </p>

              <h3 style={styles.summaryValue}>
                ₹{totalFine}
              </h3>
            </div>
          </div>

        </section>


        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <section style={styles.quickActions}>

          <Link
            to="/borrowings/issue"
            style={styles.quickCard}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#eef2ff",
              }}
            >
              📤
            </div>

            <div>
              <strong>
                Issue Book
              </strong>

              <p>
                Issue a book to a member
              </p>
            </div>

            <span>→</span>
          </Link>


          <Link
            to="/borrowings/return"
            style={styles.quickCard}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#f0fdf4",
              }}
            >
              📥
            </div>

            <div>
              <strong>
                Return Book
              </strong>

              <p>
                Process a book return
              </p>
            </div>

            <span>→</span>
          </Link>


          <Link
            to="/overdue"
            style={styles.quickCard}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#fef2f2",
              }}
            >
              ⚠️
            </div>

            <div>
              <strong>
                Overdue Books
              </strong>

              <p>
                Check overdue transactions
              </p>
            </div>

            <span>→</span>
          </Link>


          <Link
            to="/borrowings/history"
            style={styles.quickCard}
          >
            <div
              style={{
                ...styles.quickIcon,
                background: "#f5f3ff",
              }}
            >
              📜
            </div>

            <div>
              <strong>
                History
              </strong>

              <p>
                View all transactions
              </p>
            </div>

            <span>→</span>
          </Link>

        </section>


        {/* =====================================
            BORROWINGS TABLE
        ===================================== */}

        <section style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>
              <p style={styles.sectionSmall}>
                TRANSACTION RECORDS
              </p>

              <h3 style={styles.tableTitle}>
                All Borrowings
              </h3>
            </div>

            <span style={styles.recordBadge}>
              {borrowings.length} Records
            </span>

          </div>


          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>

              <p>
                Loading borrowings...
              </p>
            </div>
          ) : borrowings.length === 0 ? (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📭
              </div>

              <h3>
                No Borrowing Records
              </h3>

              <p>
                There are currently no borrowing
                transactions.
              </p>

              <Link
                to="/borrowings/issue"
                style={styles.issueButton}
              >
                + Issue First Book
              </Link>

            </div>
          ) : (
            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Transaction ID
                    </th>

                    <th style={styles.th}>
                      Member ID
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
                      Return Date
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Fine
                    </th>

                    <th style={styles.th}>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {borrowings.map((item) => {

                    const statusStyle =
                      getStatusStyle(
                        item.status
                      );

                    const isReturned =
                      String(
                        item.status || ""
                      ).toLowerCase() ===
                      "returned";

                    return (
                      <tr
                        key={item._id}
                        style={styles.tr}
                      >

                        <td style={styles.td}>
                          <strong>
                            {item.transactionId ||
                              item.issueId ||
                              "-"}
                          </strong>
                        </td>


                        <td style={styles.td}>
                          <span
                            style={
                              styles.memberBadge
                            }
                          >
                            {item.memberId || "-"}
                          </span>
                        </td>


                        <td style={styles.td}>
                          <div
                            style={
                              styles.bookCell
                            }
                          >

                            <div
                              style={
                                styles.bookIcon
                              }
                            >
                              📚
                            </div>

                            <span>
                              {item.bookId?.title ||
                                item.book?.title ||
                                "-"}
                            </span>

                          </div>
                        </td>


                        <td style={styles.td}>
                          {item.issueDate
                            ? new Date(
                                item.issueDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>


                        <td style={styles.td}>
                          {item.dueDate
                            ? new Date(
                                item.dueDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>


                        <td style={styles.td}>
                          {item.returnDate
                            ? new Date(
                                item.returnDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>


                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...statusStyle,
                            }}
                          >
                            {item.status ||
                              "Unknown"}
                          </span>
                        </td>


                        <td style={styles.td}>
                          <strong
                            style={{
                              color:
                                Number(
                                  item.fineAmount ??
                                    item.fine ??
                                    0
                                ) > 0
                                  ? "#dc2626"
                                  : "#16a34a",
                            }}
                          >
                            ₹
                            {item.fineAmount ??
                              item.fine ??
                              0}
                          </strong>
                        </td>


                        <td style={styles.td}>

                          {isReturned ? (
                            <span
                              style={
                                styles.returnedBadge
                              }
                            >
                              ✓ Returned
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                returnBook(
                                  item._id
                                )
                              }
                              style={
                                styles.returnButton
                              }
                            >
                              ↩ Return
                            </button>
                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>


        {/* =====================================
            BOTTOM NAVIGATION
        ===================================== */}

        <div style={styles.bottomNavigation}>

          <Link
            to="/dashboard"
            style={styles.secondaryButton}
          >
            ← Dashboard
          </Link>

          <Link
            to="/books"
            style={styles.secondaryButton}
          >
            📚 Books
          </Link>

          <Link
            to="/members"
            style={styles.secondaryButton}
          >
            👥 Members
          </Link>

          <Link
            to="/profile"
            style={styles.secondaryButton}
          >
            ⚙️ Profile
          </Link>

        </div>

      </main>

    </div>
  );
}


/* =================================================
   PREMIUM INLINE STYLES
   No Extra CSS File
================================================= */

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff,#f8fafc)",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif",
    color: "#0f172a",
  },

  header: {
    minHeight: "76px",
    padding: "0 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background:
      "rgba(255,255,255,0.94)",
    backdropFilter: "blur(15px)",
    borderBottom:
      "1px solid #e2e8f0",
    boxShadow:
      "0 5px 25px rgba(15,23,42,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.25)",
  },

  brandTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
  },

  brandSubtitle: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dashboardButton: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: "700",
    fontSize: "13px",
  },

  historyButton: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#f1f5f9",
    color: "#475569",
    fontWeight: "700",
    fontSize: "13px",
  },

  container: {
    width: "90%",
    maxWidth: "1500px",
    margin: "0 auto",
    padding: "40px 0",
  },

  hero: {
    padding: "32px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    background:
      "linear-gradient(135deg,#111827,#312e81)",
    color: "#fff",
    boxShadow:
      "0 20px 50px rgba(30,41,59,0.16)",
    marginBottom: "25px",
  },

  smallTitle: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#c7d2fe",
  },

  pageTitle: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "850",
  },

  description: {
    margin: "9px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  refreshButton: {
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    padding: "12px 17px",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,0.1)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "13px",
  },

  issueButton: {
    display: "inline-block",
    textDecoration: "none",
    padding: "12px 17px",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#312e81",
    fontWeight: "800",
    fontSize: "13px",
  },

  messageBox: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid",
    fontSize: "13px",
    fontWeight: "600",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  summaryCard: {
    background: "#ffffff",
    borderRadius: "17px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
  },

  summaryIcon: {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  summaryLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
  },

  summaryValue: {
    margin: "4px 0 0",
    fontSize: "27px",
    fontWeight: "850",
  },

  quickActions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "14px",
    marginBottom: "25px",
  },

  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    borderRadius: "15px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    textDecoration: "none",
    color: "#0f172a",
    boxShadow:
      "0 6px 20px rgba(15,23,42,0.04)",
  },

  quickIcon: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "11px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "19px",
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.06)",
    overflow: "hidden",
  },

  tableHeader: {
    padding: "22px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  },

  sectionSmall: {
    margin: 0,
    color: "#6366f1",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  tableTitle: {
    margin: "5px 0 0",
    fontSize: "20px",
    fontWeight: "800",
  },

  recordBadge: {
    padding: "8px 13px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "15px 14px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    borderBottom:
      "1px solid #e2e8f0",
  },

  tr: {
    borderBottom:
      "1px solid #f1f5f9",
  },

  td: {
    padding: "15px 14px",
    color: "#334155",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },

  memberBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "7px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
  },

  bookCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    maxWidth: "240px",
    whiteSpace: "normal",
  },

  bookIcon: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    fontSize: "15px",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  returnButton: {
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "8px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
  },

  returnedBadge: {
    display: "inline-block",
    padding: "7px 10px",
    borderRadius: "8px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "11px",
    fontWeight: "800",
  },

  loading: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#64748b",
  },

  spinner: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "4px solid #e2e8f0",
    borderTop:
      "4px solid #4f46e5",
    marginBottom: "15px",
  },

  emptyState: {
    padding: "65px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    margin: "0 auto 15px",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    fontSize: "32px",
  },

  bottomNavigation: {
    marginTop: "22px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  secondaryButton: {
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: "10px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  },
};

export default Borrowings;