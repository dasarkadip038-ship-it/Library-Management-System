import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import Navigation from "../components/Navigation";

function MemberDetails() {
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD MEMBER + BORROWING DATA
  // ==========================================

  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        setMessage("");

        // ==========================================
        // LOAD MEMBER DETAILS
        // ==========================================

        const response = await API.get(
          `/members/${id}`
        );

        const memberData =
          response.data.member;

        setMember(memberData);

        // ==========================================
        // LOAD ALL BORROWINGS
        // THEN FILTER BY MEMBER ID
        // ==========================================

        if (memberData?.memberId) {
          const borrowingResponse =
            await API.get("/borrowings");

          const allBorrowings =
            borrowingResponse.data.borrowings || [];

          const memberBorrowings =
            allBorrowings.filter(
              (item) =>
                String(item.memberId) ===
                String(memberData.memberId)
            );

          setBorrowings(memberBorrowings);
        }

      } catch (error) {
        console.error(
          "Member details error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Failed to load member details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id]);

  // ==========================================
  // TOTAL FINE
  // ==========================================

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

  // ==========================================
  // ACTIVE BORROWINGS
  // ==========================================

  const activeBorrowings =
    borrowings.filter((item) => {
      const status =
        item.status?.toLowerCase();

      return (
        status === "borrowed" ||
        status === "issued" ||
        status === "overdue"
      );
    });

  // ==========================================
  // OVERDUE BORROWINGS
  // ==========================================

  const overdueBorrowings =
    borrowings.filter(
      (item) =>
        item.status?.toLowerCase() ===
        "overdue"
    );

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div style={styles.loadingPage}>

        <Navigation />

        <div style={styles.loadingCard}>

          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading Member
          </h2>

          <p style={styles.loadingText}>
            Please wait while member details
            are being loaded...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // MEMBER NOT FOUND
  // ==========================================

  if (!member) {
    return (
      <div style={styles.loadingPage}>

        <Navigation />

        <div style={styles.loadingCard}>

          <div style={styles.notFoundIcon}>
            ⚠️
          </div>

          <h2 style={styles.loadingTitle}>
            Member Not Found
          </h2>

          <p style={styles.loadingText}>
            {message ||
              "The requested member could not be found."}
          </p>

          <Link
            to="/members"
            style={styles.backButton}
          >
            ← Back to Members
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <Navigation />

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}

      <main style={styles.container}>

        {/* ==========================================
            HERO
        ========================================== */}

        <section style={styles.hero}>

          <div style={styles.heroLeft}>

            <div style={styles.avatar}>
              {member.name
                ? member.name
                    .charAt(0)
                    .toUpperCase()
                : "M"}
            </div>

            <div>

              <p style={styles.smallTitle}>
                MEMBER PROFILE
              </p>

              <h2 style={styles.heroTitle}>
                {member.name}
              </h2>

              <p style={styles.heroEmail}>
                {member.email}
              </p>

              <div style={styles.memberIdBadge}>
                🪪 {member.memberId}
              </div>

            </div>

          </div>

          <div
            style={{
              ...styles.statusBadge,
              ...(member.status === "active"
                ? styles.activeStatus
                : styles.inactiveStatus),
            }}
          >
            <span style={styles.statusDot}></span>

            {member.status || "Unknown"}
          </div>

        </section>

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {message && (
          <div style={styles.errorMessage}>
            ⚠️ {message}
          </div>
        )}

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <section style={styles.statsGrid}>

          {/* TOTAL TRANSACTIONS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#eef2ff",
              }}
            >
              📚
            </div>

            <div>

              <p style={styles.statLabel}>
                Total Transactions
              </p>

              <h3 style={styles.statValue}>
                {borrowings.length}
              </h3>

            </div>

          </div>

          {/* ACTIVE BORROWINGS */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#ecfdf5",
              }}
            >
              🔄
            </div>

            <div>

              <p style={styles.statLabel}>
                Active Borrowings
              </p>

              <h3 style={styles.statValue}>
                {activeBorrowings.length}
              </h3>

            </div>

          </div>

          {/* OVERDUE */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#fff7ed",
              }}
            >
              ⚠️
            </div>

            <div>

              <p style={styles.statLabel}>
                Overdue Books
              </p>

              <h3 style={styles.statValue}>
                {overdueBorrowings.length}
              </h3>

            </div>

          </div>

          {/* TOTAL FINE */}

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#fef2f2",
              }}
            >
              💰
            </div>

            <div>

              <p style={styles.statLabel}>
                Total Fine
              </p>

              <h3 style={styles.statValue}>
                ₹{totalFine}
              </h3>

            </div>

          </div>

        </section>

        {/* ==========================================
            MEMBER INFORMATION
        ========================================== */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div style={styles.cardHeaderIcon}>
              👤
            </div>

            <div>

              <h3 style={styles.cardTitle}>
                Member Information
              </h3>

              <p style={styles.cardSubtitle}>
                Complete profile and membership details
              </p>

            </div>

          </div>

          <div style={styles.infoGrid}>

            {/* MEMBER ID */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Member ID
              </span>

              <strong style={styles.infoValue}>
                {member.memberId}
              </strong>

            </div>

            {/* NAME */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Full Name
              </span>

              <strong style={styles.infoValue}>
                {member.name}
              </strong>

            </div>

            {/* EMAIL */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Email Address
              </span>

              <strong style={styles.infoValue}>
                {member.email}
              </strong>

            </div>

            {/* PHONE */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Phone Number
              </span>

              <strong style={styles.infoValue}>
                {member.phone || "-"}
              </strong>

            </div>

            {/* MEMBERSHIP TYPE */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Membership Type
              </span>

              <strong style={styles.typeBadge}>
                {member.membershipType ||
                  "student"}
              </strong>

            </div>

            {/* STATUS */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Status
              </span>

              <strong
                style={{
                  ...styles.typeBadge,
                  ...(member.status === "active"
                    ? styles.typeActive
                    : styles.typeInactive),
                }}
              >
                {member.status || "-"}
              </strong>

            </div>

            {/* MEMBERSHIP DATE */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Membership Date
              </span>

              <strong style={styles.infoValue}>
                {member.membershipDate
                  ? new Date(
                      member.membershipDate
                    ).toLocaleDateString()
                  : "-"}
              </strong>

            </div>

            {/* EXPIRY DATE */}

            <div style={styles.infoItem}>

              <span style={styles.infoLabel}>
                Expiry Date
              </span>

              <strong style={styles.infoValue}>
                {member.expiryDate
                  ? new Date(
                      member.expiryDate
                    ).toLocaleDateString()
                  : "-"}
              </strong>

            </div>

            {/* ADDRESS */}

            <div
              style={{
                ...styles.infoItem,
                gridColumn: "1 / -1",
              }}
            >

              <span style={styles.infoLabel}>
                Address
              </span>

              <strong style={styles.infoValue}>
                {member.address || "-"}
              </strong>

            </div>

          </div>

          {/* ACTIONS */}

          <div style={styles.cardActions}>

            <Link
              to={`/members/edit/${member._id}`}
              style={styles.editButton}
            >
              ✏️ Edit Member
            </Link>

            <Link
              to="/members"
              style={styles.cancelButton}
            >
              ← Back to Members
            </Link>

          </div>

        </section>

        {/* ==========================================
            BORROWING HISTORY
        ========================================== */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div style={styles.cardHeaderIcon}>
              📖
            </div>

            <div>

              <h3 style={styles.cardTitle}>
                Borrowing History
              </h3>

              <p style={styles.cardSubtitle}>
                Books issued and returned by this member
              </p>

            </div>

          </div>

          {borrowings.length === 0 ? (

            <div style={styles.emptyCard}>

              <div style={styles.emptyIcon}>
                📚
              </div>

              <h3 style={styles.emptyTitle}>
                No Borrowing History
              </h3>

              <p style={styles.emptyText}>
                This member has no borrowing
                transactions yet.
              </p>

              <Link
                to="/borrowings/issue"
                style={styles.issueButton}
              >
                📚 Issue a Book
              </Link>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

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

                    const status =
                      item.status || "-";

                    const normalizedStatus =
                      status.toLowerCase();

                    const fine =
                      Number(
                        item.fineAmount ??
                          item.fine ??
                          0
                      );

                    return (
                      <tr
                        key={item._id}
                        style={styles.tr}
                      >

                        {/* BOOK */}

                        <td style={styles.td}>

                          <div style={styles.bookCell}>

                            <div style={styles.bookIcon}>
                              📖
                            </div>

                            <div>

                              <strong
                                style={styles.bookTitle}
                              >
                                {item.bookId?.title ||
                                  item.book?.title ||
                                  "-"}
                              </strong>

                              <span
                                style={styles.transactionId}
                              >
                                {item.transactionId ||
                                  item.issueId ||
                                  "-"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* ISSUE DATE */}

                        <td style={styles.td}>

                          {item.issueDate
                            ? new Date(
                                item.issueDate
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* DUE DATE */}

                        <td style={styles.td}>

                          {item.dueDate
                            ? new Date(
                                item.dueDate
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* RETURN DATE */}

                        <td style={styles.td}>

                          {item.returnDate
                            ? new Date(
                                item.returnDate
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                        {/* STATUS */}

                        <td style={styles.td}>

                          <span
                            style={{
                              ...styles.statusSmall,

                              ...(normalizedStatus ===
                              "overdue"
                                ? styles.overdueSmall
                                : normalizedStatus ===
                                    "returned"
                                  ? styles.returnedSmall
                                  : styles.issuedSmall),
                            }}
                          >
                            {status}
                          </span>

                        </td>

                        {/* FINE */}

                        <td style={styles.td}>

                          <strong
                            style={{
                              color:
                                fine > 0
                                  ? "#dc2626"
                                  : "#16a34a",
                            }}
                          >
                            ₹{fine}
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

        {/* ==========================================
            QUICK NAVIGATION
        ========================================== */}

        <div style={styles.quickNavigation}>

          <Link
            to="/members"
            style={styles.quickButton}
          >
            👥 All Members
          </Link>

          <Link
            to="/members/add"
            style={styles.quickButton}
          >
            ➕ Add Member
          </Link>

          <Link
            to="/borrowings"
            style={styles.quickButton}
          >
            📋 Borrowings
          </Link>

          <Link
            to="/borrowings/issue"
            style={styles.quickButton}
          >
            📚 Issue Book
          </Link>

        </div>

      </main>

    </div>
  );
}


/* =================================================
   PREMIUM INLINE STYLES
   NO EXTRA CSS FILE
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

  loadingPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#eef2ff,#f8fafc)",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif",
  },

  loadingCard: {
    width: "min(90%,420px)",
    margin: "80px auto",
    background: "#ffffff",
    padding: "45px",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(15,23,42,0.12)",
  },

  spinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    borderRadius: "50%",
    border: "4px solid #e2e8f0",
    borderTop:
      "4px solid #4f46e5",
  },

  loadingTitle: {
    margin: "18px 0 5px",
    fontSize: "20px",
  },

  loadingText: {
    margin: "0 0 20px",
    color: "#64748b",
    fontSize: "13px",
  },

  notFoundIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  backButton: {
    display: "inline-block",
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
  },

  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 0 50px",
  },

  hero: {
    padding: "30px 34px",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    background:
      "linear-gradient(135deg,#111827,#312e81,#4338ca)",
    color: "#ffffff",
    boxShadow:
      "0 20px 50px rgba(30,41,59,0.16)",
    marginBottom: "25px",
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  avatar: {
    width: "72px",
    height: "72px",
    flexShrink: 0,
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "850",
  },

  smallTitle: {
    margin: "0 0 7px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#c7d2fe",
  },

  heroTitle: {
    margin: 0,
    fontSize: "29px",
    fontWeight: "850",
  },

  heroEmail: {
    margin: "5px 0 10px",
    color: "#cbd5e1",
    fontSize: "12px",
  },

  memberIdBadge: {
    width: "fit-content",
    padding: "7px 11px",
    borderRadius: "8px",
    background:
      "rgba(255,255,255,0.1)",
    color: "#e0e7ff",
    fontSize: "10px",
  },

  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 13px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  activeStatus: {
    background:
      "rgba(34,197,94,0.15)",
    color: "#bbf7d0",
    border:
      "1px solid rgba(134,239,172,0.2)",
  },

  inactiveStatus: {
    background:
      "rgba(239,68,68,0.15)",
    color: "#fecaca",
    border:
      "1px solid rgba(252,165,165,0.2)",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "currentColor",
  },

  errorMessage: {
    marginBottom: "22px",
    padding: "14px 17px",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    fontSize: "12px",
    fontWeight: "600",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "19px",
    borderRadius: "16px",
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "10px",
    fontWeight: "700",
  },

  statValue: {
    margin: "4px 0 0",
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "850",
  },

  card: {
    background: "#ffffff",
    borderRadius: "19px",
    padding: "26px",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 8px 28px rgba(15,23,42,0.05)",
    marginBottom: "25px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "20px",
    marginBottom: "22px",
    borderBottom:
      "1px solid #f1f5f9",
  },

  cardHeaderIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    fontSize: "20px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",
    gap: "13px",
  },

  infoItem: {
    padding: "14px",
    borderRadius: "11px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
  },

  infoLabel: {
    display: "block",
    marginBottom: "6px",
    color: "#94a3b8",
    fontSize: "9px",
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: "0.6px",
  },

  infoValue: {
    display: "block",
    color: "#334155",
    fontSize: "12px",
    wordBreak: "break-word",
  },

  typeBadge: {
    display: "inline-block",
    width: "fit-content",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "10px",
    textTransform: "capitalize",
  },

  typeActive: {
    background: "#ecfdf5",
    color: "#15803d",
  },

  typeInactive: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  cardActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "22px",
    paddingTop: "20px",
    borderTop:
      "1px solid #f1f5f9",
  },

  editButton: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "700",
  },

  cancelButton: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#475569",
    border:
      "1px solid #e2e8f0",
    fontSize: "11px",
    fontWeight: "700",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "850px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "13px 14px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  tr: {
    borderBottom:
      "1px solid #f1f5f9",
  },

  td: {
    padding: "14px",
    color: "#475569",
    fontSize: "11px",
  },

  bookCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  bookIcon: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
  },

  bookTitle: {
    display: "block",
    color: "#334155",
    fontSize: "11px",
  },

  transactionId: {
    display: "block",
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "9px",
  },

  statusSmall: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  issuedSmall: {
    background: "#eef2ff",
    color: "#4338ca",
  },

  returnedSmall: {
    background: "#ecfdf5",
    color: "#15803d",
  },

  overdueSmall: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  emptyCard: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#f8fafc",
    borderRadius: "14px",
    border:
      "1px dashed #cbd5e1",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 13px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    fontSize: "26px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#334155",
  },

  emptyText: {
    margin: "6px 0 17px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  issueButton: {
    display: "inline-block",
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "700",
  },

  quickNavigation: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  quickButton: {
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "9px",
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "11px",
    fontWeight: "700",
  },
};

export default MemberDetails;