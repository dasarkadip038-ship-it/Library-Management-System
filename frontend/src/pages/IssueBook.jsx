import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function IssueBook() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [booksResponse, membersResponse] =
          await Promise.all([
            API.get("/books", {
              params: { available: "true" },
            }),
            API.get("/members", {
              params: { status: "active" },
            }),
          ]);

        setBooks(booksResponse.data.books || []);
        setMembers(membersResponse.data.members || []);
      } catch (error) {
        console.error("Load Issue Book data error:", error);

        setMessage(
          error.response?.data?.message ||
            "Failed to load data"
        );

        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberId || !bookId || !dueDate) {
      setMessage("Please fill all required fields");
      setMessageType("error");
      return;
    }

    try {
      setIssuing(true);
      setMessage("");

      console.log("Issuing book...");
      console.log("Member ID:", memberId);
      console.log("Book ID:", bookId);
      console.log("Due Date:", dueDate);

      const response = await API.post(
        "/borrowings/issue",
        {
          memberId,
          bookId,
          dueDate,
        }
      );

      console.log("Issue Book Response:", response.data);

      /*
        Backend should return:
        {
          success: true,
          message: "Book issued successfully",
          borrowing: {...}
        }
      */

      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data
      ) {
        setMessage(
          response.data.message ||
            "Book issued successfully"
        );

        setMessageType("success");

        // Update selected book availability locally
        setBooks((previousBooks) =>
          previousBooks.map((book) =>
            book._id === bookId
              ? {
                  ...book,
                  availableCopies: Math.max(
                    0,
                    Number(book.availableCopies || 0) - 1
                  ),
                }
              : book
          )
        );

        // Clear form
        setMemberId("");
        setBookId("");
        setDueDate("");

        // Go to borrowings page
        setTimeout(() => {
          navigate("/borrowings");
        }, 800);
      } else {
        throw new Error(
          response.data?.message ||
            "Failed to issue book"
        );
      }
    } catch (error) {
      console.error("Issue Book Error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to issue book"
      );

      setMessageType("error");
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading Issue Book
          </h2>

          <p style={styles.loadingText}>
            Loading available books and active members...
          </p>
        </div>
      </div>
    );
  }

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
              Borrowing Management
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

        {/* HERO */}

        <section style={styles.hero}>

          <div>

            <p style={styles.smallTitle}>
              BORROWING MANAGEMENT
            </p>

            <h2 style={styles.pageTitle}>
              Issue Book
            </h2>

            <p style={styles.heroDescription}>
              Issue an available library book to an
              active member.
            </p>

          </div>

          <div style={styles.heroIcon}>
            📖
          </div>

        </section>


        {/* MESSAGE */}

        {message && (
          <div
            style={
              messageType === "success"
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {messageType === "success"
              ? "✅"
              : "⚠️"}{" "}
            {message}
          </div>
        )}


        {/* ================= FORM CARD ================= */}

        <section style={styles.formCard}>

          <div style={styles.formHeader}>

            <div style={styles.formHeaderIcon}>
              📚
            </div>

            <div>
              <h3 style={styles.formTitle}>
                Issue Book Details
              </h3>

              <p style={styles.formSubtitle}>
                Select an active member, available book,
                and due date.
              </p>
            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* MEMBER */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Select Member *
                </label>

                <select
                  value={memberId}
                  onChange={(e) =>
                    setMemberId(e.target.value)
                  }
                  required
                  style={styles.input}
                  disabled={issuing}
                >
                  <option value="">
                    Select Member
                  </option>

                  {members.map((member) => (
                    <option
                      key={member._id}
                      value={member.memberId}
                    >
                      {member.memberId} - {member.name}
                    </option>
                  ))}
                </select>

                <span style={styles.helperText}>
                  Only active members are displayed.
                </span>

              </div>


              {/* BOOK */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Select Book *
                </label>

                <select
                  value={bookId}
                  onChange={(e) =>
                    setBookId(e.target.value)
                  }
                  required
                  style={styles.input}
                  disabled={issuing}
                >
                  <option value="">
                    Select Book
                  </option>

                  {books.map((book) => (
                    <option
                      key={book._id}
                      value={book._id}
                    >
                      {book.title} - Available:{" "}
                      {book.availableCopies}
                    </option>
                  ))}
                </select>

                <span style={styles.helperText}>
                  Only books with available copies are
                  displayed.
                </span>

              </div>


              {/* DUE DATE */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Due Date *
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  required
                  style={styles.input}
                  disabled={issuing}
                />

                <span style={styles.helperText}>
                  Select the date by which the book should
                  be returned.
                </span>

              </div>

            </div>


            {/* SUMMARY */}

            <div style={styles.summaryCard}>

              <div style={styles.summaryHeader}>
                <span style={styles.summaryIcon}>
                  📋
                </span>

                <strong>
                  Issue Summary
                </strong>
              </div>

              <div style={styles.summaryGrid}>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    Member
                  </span>

                  <strong style={styles.summaryValue}>
                    {memberId || "Not selected"}
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    Book
                  </span>

                  <strong style={styles.summaryValue}>
                    {bookId
                      ? books.find(
                          (book) =>
                            book._id === bookId
                        )?.title || "Selected"
                      : "Not selected"}
                  </strong>
                </div>

                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    Due Date
                  </span>

                  <strong style={styles.summaryValue}>
                    {dueDate || "Not selected"}
                  </strong>
                </div>

              </div>

            </div>


            {/* ACTIONS */}

            <div style={styles.formActions}>

              <button
                type="button"
                onClick={() =>
                  navigate("/borrowings")
                }
                style={styles.cancelButton}
                disabled={issuing}
              >
                ← Cancel
              </button>

              <button
                type="submit"
                style={styles.issueButton}
                disabled={issuing}
              >
                {issuing
                  ? "Issuing..."
                  : "📚 Issue Book"}
              </button>

            </div>

          </form>

        </section>


        {/* ================= QUICK NAVIGATION ================= */}

        <div style={styles.quickNavigation}>

          <Link
            to="/borrowings"
            style={styles.quickButton}
          >
            📋 All Borrowings
          </Link>

          <Link
            to="/borrowings/return"
            style={styles.quickButton}
          >
            ↩️ Return Book
          </Link>

          <Link
            to="/overdue"
            style={styles.quickButton}
          >
            ⚠️ Overdue Books
          </Link>

          <Link
            to="/books"
            style={styles.quickButton}
          >
            📚 Books
          </Link>

          <Link
            to="/members"
            style={styles.quickButton}
          >
            👥 Members
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

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#eef2ff,#f8fafc)",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif",
  },

  loadingCard: {
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
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
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
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: "700",
    fontSize: "13px",
  },

  container: {
    width: "90%",
    maxWidth: "1100px",
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
    color: "#ffffff",
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

  heroDescription: {
    margin: "9px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  heroIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "rgba(255,255,255,0.1)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    fontSize: "30px",
  },

  successMessage: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    fontSize: "13px",
    fontWeight: "600",
  },

  errorMessage: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    fontSize: "13px",
    fontWeight: "600",
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.06)",
  },

  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    paddingBottom: "22px",
    marginBottom: "25px",
    borderBottom:
      "1px solid #f1f5f9",
  },

  formHeaderIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    fontSize: "21px",
  },

  formTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800",
  },

  formSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",
    gap: "22px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "8px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "13px",
    cursor: "pointer",
  },

  helperText: {
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  summaryCard: {
    marginTop: "28px",
    padding: "20px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",
    border:
      "1px solid #e2e8f0",
  },

  summaryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#334155",
    fontSize: "14px",
    marginBottom: "16px",
  },

  summaryIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",
    gap: "15px",
  },

  summaryItem: {
    padding: "13px",
    background: "#ffffff",
    borderRadius: "10px",
    border:
      "1px solid #e2e8f0",
    minWidth: 0,
  },

  summaryLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "5px",
  },

  summaryValue: {
    display: "block",
    color: "#334155",
    fontSize: "12px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  formActions: {
    marginTop: "28px",
    paddingTop: "22px",
    borderTop:
      "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  cancelButton: {
    border:
      "1px solid #e2e8f0",
    cursor: "pointer",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  },

  issueButton: {
    border: "none",
    cursor: "pointer",
    padding: "12px 21px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow:
      "0 7px 18px rgba(79,70,229,0.22)",
  },

  quickNavigation: {
    marginTop: "22px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  quickButton: {
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

export default IssueBook;