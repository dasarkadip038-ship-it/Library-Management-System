import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function BorrowingHistory() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBorrowingHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/borrowings");

      const data =
        response.data.borrowings || response.data || [];

      setBorrowings(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load borrowing history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowingHistory();
  }, []);

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

  return (
    <div style={styles.page}>

      {/* ================= HEADER ================= */}

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
              Borrowing & Transaction Management
            </p>
          </div>
        </div>

        <Link
          to="/dashboard"
          style={styles.dashboardButton}
        >
          ← Dashboard
        </Link>

      </header>


      {/* ================= MAIN ================= */}

      <main style={styles.container}>

        {/* Page Heading */}

        <section style={styles.hero}>

          <div>
            <p style={styles.smallTitle}>
              TRANSACTION RECORDS
            </p>

            <h2 style={styles.pageTitle}>
              Borrowing History
            </h2>

            <p style={styles.description}>
              View all book issue and return transactions
              recorded in the library.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBorrowingHistory}
            style={styles.refreshButton}
          >
            ↻ Refresh History
          </button>

        </section>


        {/* ================= SUMMARY ================= */}

        <section style={styles.summaryGrid}>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: "#eef2ff",
              }}
            >
              📜
            </div>

            <div>
              <p style={styles.summaryLabel}>
                Total Transactions
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
                Active Borrowings
              </p>

              <h3 style={styles.summaryValue}>
                {
                  borrowings.filter((item) => {
                    const status =
                      String(item.status || "")
                        .toLowerCase();

                    return (
                      status === "borrowed" ||
                      status === "issued"
                    );
                  }).length
                }
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
                {
                  borrowings.filter(
                    (item) =>
                      String(
                        item.status || ""
                      ).toLowerCase() ===
                      "returned"
                  ).length
                }
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
                {
                  borrowings.filter(
                    (item) =>
                      String(
                        item.status || ""
                      ).toLowerCase() ===
                      "overdue"
                  ).length
                }
              </h3>
            </div>
          </div>

        </section>


        {/* ================= ERROR ================= */}

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}


        {/* ================= TABLE ================= */}

        <section style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>
              <p style={styles.sectionSmall}>
                COMPLETE RECORD
              </p>

              <h3 style={styles.tableTitle}>
                All Borrowing Transactions
              </h3>
            </div>

            <span style={styles.transactionCount}>
              {borrowings.length} Records
            </span>

          </div>


          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>

              <p>
                Loading borrowing history...
              </p>
            </div>
          ) : borrowings.length === 0 ? (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📭
              </div>

              <h3>
                No Borrowing History
              </h3>

              <p>
                There are no borrowing transactions
                available at the moment.
              </p>

              <Link
                to="/borrowings"
                style={styles.primaryButton}
              >
                Go to Borrowings
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

                  </tr>
                </thead>

                <tbody>

                  {borrowings.map((item) => {

                    const statusStyle =
                      getStatusStyle(
                        item.status
                      );

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

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>


        {/* ================= BOTTOM ACTIONS ================= */}

        <div style={styles.bottomActions}>

          <Link
            to="/borrowings"
            style={styles.secondaryButton}
          >
            ← Back to Borrowings
          </Link>

          <Link
            to="/borrowings/issue"
            style={styles.primaryButton}
          >
            📤 Issue Book
          </Link>

          <Link
            to="/borrowings/return"
            style={styles.primaryButton}
          >
            📥 Return Book
          </Link>

          <Link
            to="/overdue"
            style={styles.warningButton}
          >
            ⚠️ Overdue Books
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
      "linear-gradient(135deg, #f8fafc, #eef2ff, #f8fafc)",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
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

  dashboardButton: {
    textDecoration: "none",
    padding: "10px 17px",
    borderRadius: "10px",
    color: "#4338ca",
    background: "#eef2ff",
    fontWeight: "700",
    fontSize: "14px",
  },

  container: {
    width: "90%",
    maxWidth: "1450px",
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

  refreshButton: {
    border: "none",
    cursor: "pointer",
    padding: "13px 19px",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#312e81",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.12)",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom: "25px",
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
    fontSize: "26px",
    fontWeight: "850",
  },

  errorBox: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    color: "#991b1b",
    background: "#fef2f2",
    border: "1px solid #fecaca",
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

  transactionCount: {
    padding: "8px 12px",
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
    borderCollapse: "collapse",
    minWidth: "950px",
  },

  th: {
    padding: "15px 14px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
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
    maxWidth: "250px",
    whiteSpace: "normal",
  },

  bookIcon: {
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

  loading: {
    minHeight: "280px",
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
    borderTop: "4px solid #4f46e5",
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

  primaryButton: {
    display: "inline-block",
    textDecoration: "none",
    marginTop: "10px",
    padding: "11px 17px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
  },

  bottomActions: {
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

  warningButton: {
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: "10px",
    background: "#fff7ed",
    color: "#c2410c",
    border: "1px solid #fed7aa",
    fontSize: "13px",
    fontWeight: "700",
  },
};

export default BorrowingHistory;