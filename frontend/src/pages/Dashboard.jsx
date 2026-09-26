import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [statisticsResponse, activityResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:5000/api/dashboard/statistics",
              { headers }
            ),
            axios.get(
              "http://localhost:5000/api/dashboard/recent-activity",
              { headers }
            ),
          ]);

        setStatistics(statisticsResponse.data.statistics);
        setRecentActivity(
          activityResponse.data.recentActivity
        );
      } catch (error) {
        console.error("Dashboard Error:", error);

        setMessage(
          error.response?.data?.message ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setMessage("Authentication required");
      setLoading(false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h2 style={{ margin: "18px 0 5px" }}>
            Loading Dashboard
          </h2>
          <p style={{ color: "#64748b", margin: 0 }}>
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* =========================================
          HEADER
      ========================================= */}

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
              Smart Library Administration
            </p>
          </div>
        </div>

        <div style={styles.headerActions}>
          <Link
            to="/profile"
            style={styles.profileButton}
          >
            👤 Profile
          </Link>

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            ↪ Logout
          </button>
        </div>

      </header>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main style={styles.container}>

        {/* Welcome Section */}

        <section style={styles.welcomeSection}>

          <div>
            <p style={styles.smallTitle}>
              LIBRARY OVERVIEW
            </p>

            <h2 style={styles.dashboardTitle}>
              Dashboard
            </h2>

            <p style={styles.welcomeText}>
              Manage books, members, borrowings and
              library activities from one place.
            </p>
          </div>

          <div style={styles.dateBox}>
            <span style={{ fontSize: "22px" }}>
              📅
            </span>

            <div>
              <small style={styles.dateLabel}>
                TODAY
              </small>

              <strong style={styles.dateText}>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </strong>
            </div>
          </div>

        </section>


        {/* Error / Message */}

        {message && (
          <div style={styles.messageBox}>
            ⚠️ {message}
          </div>
        )}


        {/* =========================================
            STATISTICS
        ========================================= */}

        <section>

          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionSmall}>
                PERFORMANCE
              </p>

              <h3 style={styles.sectionTitle}>
                Library Statistics
              </h3>
            </div>
          </div>


          {statistics && (
            <div style={styles.statsGrid}>

              {/* Total Books */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #4f46e5",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#eef2ff",
                    }}
                  >
                    📚
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Total Books
                </p>

                <h3 style={styles.statValue}>
                  {statistics.totalBooks}
                </h3>

                <p style={styles.statDescription}>
                  Books in library
                </p>
              </div>


              {/* Total Copies */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #0891b2",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#ecfeff",
                    }}
                  >
                    📦
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Total Copies
                </p>

                <h3 style={styles.statValue}>
                  {statistics.totalCopies}
                </h3>

                <p style={styles.statDescription}>
                  Physical copies
                </p>
              </div>


              {/* Available Copies */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #16a34a",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#f0fdf4",
                    }}
                  >
                    ✅
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Available Copies
                </p>

                <h3 style={styles.statValue}>
                  {statistics.availableCopies}
                </h3>

                <p style={styles.statDescription}>
                  Currently available
                </p>
              </div>


              {/* Total Members */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #9333ea",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#faf5ff",
                    }}
                  >
                    👥
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Total Members
                </p>

                <h3 style={styles.statValue}>
                  {statistics.totalMembers}
                </h3>

                <p style={styles.statDescription}>
                  Registered members
                </p>
              </div>


              {/* Active Members */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #0d9488",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#f0fdfa",
                    }}
                  >
                    🟢
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Active Members
                </p>

                <h3 style={styles.statValue}>
                  {statistics.activeMembers}
                </h3>

                <p style={styles.statDescription}>
                  Active library members
                </p>
              </div>


              {/* Issued Books */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #ea580c",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#fff7ed",
                    }}
                  >
                    📖
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Issued Books
                </p>

                <h3 style={styles.statValue}>
                  {statistics.issuedBooks}
                </h3>

                <p style={styles.statDescription}>
                  Currently issued
                </p>
              </div>


              {/* Overdue Books */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #dc2626",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#fef2f2",
                    }}
                  >
                    ⚠️
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Overdue Books
                </p>

                <h3 style={styles.statValue}>
                  {statistics.overdueBooks}
                </h3>

                <p style={styles.statDescription}>
                  Need attention
                </p>
              </div>


              {/* Total Fines */}

              <div
                style={{
                  ...styles.statCard,
                  borderTop: "4px solid #ca8a04",
                }}
              >
                <div style={styles.statTop}>
                  <div
                    style={{
                      ...styles.statIcon,
                      background: "#fefce8",
                    }}
                  >
                    💰
                  </div>

                  <span style={styles.statArrow}>
                    ↗
                  </span>
                </div>

                <p style={styles.statLabel}>
                  Total Fines
                </p>

                <h3 style={styles.statValue}>
                  ₹{statistics.totalFines}
                </h3>

                <p style={styles.statDescription}>
                  Outstanding fines
                </p>
              </div>

            </div>
          )}

        </section>


        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section style={styles.quickSection}>

          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionSmall}>
                QUICK ACCESS
              </p>

              <h3 style={styles.sectionTitle}>
                Library Management
              </h3>
            </div>
          </div>


          <div style={styles.actionGrid}>

            <Link
              to="/books"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#eef2ff",
                }}
              >
                📚
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Books
                </strong>

                <p style={styles.actionText}>
                  View and manage books
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/books/add"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#f0fdf4",
                }}
              >
                ➕
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Add Book
                </strong>

                <p style={styles.actionText}>
                  Add a new library book
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/members"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#faf5ff",
                }}
              >
                👥
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Members
                </strong>

                <p style={styles.actionText}>
                  Manage library members
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/members/add"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#ecfeff",
                }}
              >
                👤
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Add Member
                </strong>

                <p style={styles.actionText}>
                  Register new member
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/borrowings"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#fff7ed",
                }}
              >
                🔄
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Borrowings
                </strong>

                <p style={styles.actionText}>
                  Manage borrowing records
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/borrowings/issue"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#f0fdfa",
                }}
              >
                📤
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Issue Book
                </strong>

                <p style={styles.actionText}>
                  Issue book to a member
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/borrowings/return"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#fefce8",
                }}
              >
                📥
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Return Book
                </strong>

                <p style={styles.actionText}>
                  Process returned books
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/overdue"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#fef2f2",
                }}
              >
                ⚠️
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Overdue Books
                </strong>

                <p style={styles.actionText}>
                  Check overdue books
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/borrowings/history"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#f5f3ff",
                }}
              >
                📜
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Borrowing History
                </strong>

                <p style={styles.actionText}>
                  View all transactions
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/categories"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#eff6ff",
                }}
              >
                🗂️
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Categories
                </strong>

                <p style={styles.actionText}>
                  Manage book categories
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/borrowings/my"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#fdf2f8",
                }}
              >
                📖
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  My Borrowed Books
                </strong>

                <p style={styles.actionText}>
                  View borrowed books
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/member-dashboard"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#f0fdf4",
                }}
              >
                👨‍🎓
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Member Dashboard
                </strong>

                <p style={styles.actionText}>
                  Open member dashboard
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>


            <Link
              to="/profile"
              style={styles.actionCard}
            >
              <span
                style={{
                  ...styles.actionIcon,
                  background: "#f1f5f9",
                }}
              >
                ⚙️
              </span>

              <div>
                <strong style={styles.actionTitle}>
                  Profile
                </strong>

                <p style={styles.actionText}>
                  Manage your profile
                </p>
              </div>

              <span style={styles.actionArrow}>
                →
              </span>
            </Link>

          </div>

        </section>


        {/* =========================================
            RECENT ACTIVITY
        ========================================= */}

        <section style={styles.activitySection}>

          <div style={styles.sectionHeader}>
            <div>
              <p style={styles.sectionSmall}>
                LATEST UPDATES
              </p>

              <h3 style={styles.sectionTitle}>
                Recent Activity
              </h3>
            </div>
          </div>


          <div style={styles.activityGrid}>

            {/* Recent Issues */}

            <div style={styles.activityCard}>

              <div style={styles.activityHeader}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#fff7ed",
                  }}
                >
                  📤
                </div>

                <div>
                  <h4 style={styles.activityTitle}>
                    Recent Issues
                  </h4>

                  <p style={styles.activitySubtitle}>
                    Latest borrowing transactions
                  </p>
                </div>
              </div>

              {recentActivity?.issues?.length > 0 ? (
                <div>
                  {recentActivity.issues.map(
                    (issue) => (
                      <div
                        key={issue._id}
                        style={styles.activityItem}
                      >
                        <div>
                          <strong>
                            {issue.issueId}
                          </strong>

                          <p style={styles.itemText}>
                            Member: {issue.memberId}
                          </p>
                        </div>

                        <span style={styles.itemArrow}>
                          →
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p style={styles.emptyText}>
                  No recent issues
                </p>
              )}

            </div>


            {/* Recent Books */}

            <div style={styles.activityCard}>

              <div style={styles.activityHeader}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#eef2ff",
                  }}
                >
                  📚
                </div>

                <div>
                  <h4 style={styles.activityTitle}>
                    Recent Books
                  </h4>

                  <p style={styles.activitySubtitle}>
                    Recently added books
                  </p>
                </div>
              </div>

              {recentActivity?.books?.length > 0 ? (
                <div>
                  {recentActivity.books.map(
                    (book) => (
                      <div
                        key={book._id}
                        style={styles.activityItem}
                      >
                        <div>
                          <strong>
                            {book.title}
                          </strong>

                          <p style={styles.itemText}>
                            {book.author || "Library Book"}
                          </p>
                        </div>

                        <span style={styles.itemArrow}>
                          →
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p style={styles.emptyText}>
                  No recent books
                </p>
              )}

            </div>


            {/* Recent Members */}

            <div style={styles.activityCard}>

              <div style={styles.activityHeader}>
                <div
                  style={{
                    ...styles.activityIcon,
                    background: "#faf5ff",
                  }}
                >
                  👥
                </div>

                <div>
                  <h4 style={styles.activityTitle}>
                    Recent Members
                  </h4>

                  <p style={styles.activitySubtitle}>
                    Recently registered members
                  </p>
                </div>
              </div>

              {recentActivity?.members?.length > 0 ? (
                <div>
                  {recentActivity.members.map(
                    (member) => (
                      <div
                        key={member._id}
                        style={styles.activityItem}
                      >
                        <div>
                          <strong>
                            {member.memberId}
                          </strong>

                          <p style={styles.itemText}>
                            {member.name}
                          </p>
                        </div>

                        <span style={styles.itemArrow}>
                          →
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p style={styles.emptyText}>
                  No recent members
                </p>
              )}

            </div>

          </div>

        </section>


        {/* =========================================
            FOOTER
        ========================================= */}

        <footer style={styles.footer}>
          <p>
            © {new Date().getFullYear()} Library
            Management System
          </p>

          <p>
            MERN Stack Library Management System
          </p>
        </footer>

      </main>

    </div>
  );
}


/* =================================================
   INLINE PREMIUM STYLES
   No External CSS Required
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

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #eef2ff, #f8fafc)",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  loadingCard: {
    background: "#ffffff",
    padding: "45px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(15, 23, 42, 0.12)",
  },

  spinner: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #4f46e5",
    margin: "0 auto",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    minHeight: "76px",
    padding: "0 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background:
      "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(15px)",
    borderBottom:
      "1px solid rgba(226, 232, 240, 0.8)",
    boxShadow:
      "0 4px 20px rgba(15, 23, 42, 0.05)",
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
    fontSize: "25px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    boxShadow:
      "0 8px 20px rgba(79, 70, 229, 0.25)",
  },

  brandTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
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

  profileButton: {
    textDecoration: "none",
    color: "#334155",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },

  logoutButton: {
    border: "none",
    color: "#ffffff",
    background:
      "linear-gradient(135deg, #ef4444, #dc2626)",
    padding: "10px 17px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow:
      "0 5px 15px rgba(220, 38, 38, 0.2)",
  },

  container: {
    width: "90%",
    maxWidth: "1450px",
    margin: "0 auto",
    padding: "40px 0",
  },

  welcomeSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "35px",
    padding: "35px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, #111827, #312e81)",
    color: "#ffffff",
    boxShadow:
      "0 20px 50px rgba(30, 41, 59, 0.18)",
  },

  smallTitle: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#c7d2fe",
  },

  dashboardTitle: {
    margin: 0,
    fontSize: "38px",
    fontWeight: "850",
    letterSpacing: "-1px",
  },

  welcomeText: {
    margin: "10px 0 0",
    color: "#cbd5e1",
    fontSize: "15px",
  },

  dateBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.1)",
    border:
      "1px solid rgba(255,255,255,0.15)",
  },

  dateLabel: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "10px",
    letterSpacing: "1px",
  },

  dateText: {
    display: "block",
    marginTop: "3px",
    fontSize: "14px",
  },

  messageBox: {
    marginBottom: "25px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "#fff7ed",
    color: "#9a3412",
    border: "1px solid #fed7aa",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  sectionSmall: {
    margin: 0,
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  sectionTitle: {
    margin: "5px 0 0",
    fontSize: "24px",
    fontWeight: "800",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "45px",
  },

  statCard: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.07)",
    transition: "transform 0.2s ease",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "21px",
  },

  statArrow: {
    color: "#94a3b8",
    fontSize: "18px",
  },

  statLabel: {
    margin: "18px 0 5px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
  },

  statValue: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "850",
  },

  statDescription: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  quickSection: {
    marginBottom: "45px",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "17px",
    borderRadius: "16px",
    background: "#ffffff",
    textDecoration: "none",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 6px 20px rgba(15, 23, 42, 0.04)",
  },

  actionIcon: {
    minWidth: "45px",
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },

  actionTitle: {
    display: "block",
    fontSize: "14px",
  },

  actionText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  actionArrow: {
    marginLeft: "auto",
    color: "#94a3b8",
    fontSize: "18px",
  },

  activitySection: {
    marginBottom: "30px",
  },

  activityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  activityCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.06)",
    border: "1px solid #e2e8f0",
  },

  activityHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "15px",
    marginBottom: "5px",
    borderBottom: "1px solid #f1f5f9",
  },

  activityIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "19px",
  },

  activityTitle: {
    margin: 0,
    fontSize: "15px",
  },

  activitySubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "13px 0",
    borderBottom: "1px solid #f1f5f9",
  },

  itemText: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  itemArrow: {
    color: "#94a3b8",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: "13px",
    padding: "20px 0",
    textAlign: "center",
  },

  footer: {
    marginTop: "50px",
    padding: "25px 0",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "12px",
  },
};

export default Dashboard;