import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/members", {
        params: {
          search,
        },
      });

      setMembers(response.data.members || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load members"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = () => {
    fetchMembers();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearch("");

    setTimeout(() => {
      fetchMembers();
    }, 0);
  };

  const deleteMember = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/members/${id}`);

      setMessage(
        "Member deleted successfully"
      );
      setMessageType("success");

      fetchMembers();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete member"
      );
      setMessageType("error");
    }
  };

  const activeMembers = members.filter(
    (member) => member.status === "active"
  ).length;

  const inactiveMembers = members.filter(
    (member) => member.status === "inactive"
  ).length;

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
              Member Management
            </p>
          </div>

        </div>

        <div style={styles.headerActions}>

          <Link
            to="/dashboard"
            style={styles.dashboardButton}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/members/add"
            style={styles.addButton}
          >
            + Add Member
          </Link>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main style={styles.container}>

        {/* HERO */}

        <section style={styles.hero}>

          <div>

            <p style={styles.smallTitle}>
              MEMBER MANAGEMENT
            </p>

            <h2 style={styles.pageTitle}>
              Library Members
            </h2>

            <p style={styles.heroDescription}>
              Manage member profiles, memberships,
              contact information and account status.
            </p>

          </div>

          <div style={styles.heroIcon}>
            👥
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
            <span>
              {messageType === "success"
                ? "✓"
                : "!"}
            </span>

            {message}
          </div>
        )}


        {/* ================= STATISTICS ================= */}

        <section style={styles.statsGrid}>

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#eef2ff",
              }}
            >
              👥
            </div>

            <div>
              <p style={styles.statLabel}>
                Total Members
              </p>

              <h3 style={styles.statValue}>
                {members.length}
              </h3>

              <span style={styles.statHint}>
                Members found
              </span>
            </div>

          </div>


          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#ecfdf5",
              }}
            >
              ✓
            </div>

            <div>
              <p style={styles.statLabel}>
                Active Members
              </p>

              <h3 style={styles.statValue}>
                {activeMembers}
              </h3>

              <span style={styles.statHint}>
                Currently active
              </span>
            </div>

          </div>


          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#fef2f2",
              }}
            >
              ⏸
            </div>

            <div>
              <p style={styles.statLabel}>
                Inactive Members
              </p>

              <h3 style={styles.statValue}>
                {inactiveMembers}
              </h3>

              <span style={styles.statHint}>
                Currently inactive
              </span>
            </div>

          </div>

        </section>


        {/* ================= SEARCH ================= */}

        <section style={styles.searchCard}>

          <div style={styles.searchHeader}>

            <div>

              <h3 style={styles.sectionTitle}>
                Search Members
              </h3>

              <p style={styles.sectionSubtitle}>
                Search by member ID, name, email or
                phone number.
              </p>

            </div>

            <button
              type="button"
              onClick={fetchMembers}
              style={styles.refreshButton}
              disabled={loading}
            >
              {loading
                ? "⟳ Loading..."
                : "↻ Refresh"}
            </button>

          </div>


          <div style={styles.searchArea}>

            <div style={styles.searchInputWrapper}>

              <span style={styles.searchIcon}>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by ID, name, email or phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={handleKeyDown}
                style={styles.searchInput}
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  style={styles.clearButton}
                >
                  ×
                </button>
              )}

            </div>

            <button
              type="button"
              onClick={handleSearch}
              style={styles.searchButton}
            >
              🔍 Search
            </button>

          </div>

        </section>


        {/* ================= MEMBERS TABLE ================= */}

        <section style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>

              <h3 style={styles.sectionTitle}>
                All Members
              </h3>

              <p style={styles.sectionSubtitle}>
                {members.length} member
                {members.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>

            </div>

            <Link
              to="/members/add"
              style={styles.tableAddButton}
            >
              + Add New Member
            </Link>

          </div>


          {loading ? (

            <div style={styles.loadingArea}>

              <div style={styles.spinner}></div>

              <h3 style={styles.loadingTitle}>
                Loading members...
              </h3>

              <p style={styles.loadingText}>
                Please wait while member data is
                loaded.
              </p>

            </div>

          ) : members.length === 0 ? (

            <div style={styles.emptyArea}>

              <div style={styles.emptyIcon}>
                👥
              </div>

              <h3 style={styles.emptyTitle}>
                No Members Found
              </h3>

              <p style={styles.emptyText}>
                No members match your current search.
              </p>

              <Link
                to="/members/add"
                style={styles.emptyButton}
              >
                + Add New Member
              </Link>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Member
                    </th>

                    <th style={styles.th}>
                      Contact
                    </th>

                    <th style={styles.th}>
                      Type
                    </th>

                    <th style={styles.th}>
                      Membership
                    </th>

                    <th style={styles.th}>
                      Expiry
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {members.map((member) => (

                    <tr
                      key={member._id}
                      style={styles.tr}
                    >

                      {/* MEMBER */}

                      <td style={styles.td}>

                        <div style={styles.memberCell}>

                          <div style={styles.avatar}>
                            {member.name
                              ? member.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "M"}
                          </div>

                          <div>

                            <strong
                              style={styles.memberName}
                            >
                              {member.name}
                            </strong>

                            <span
                              style={
                                styles.memberId
                              }
                            >
                              {member.memberId}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td style={styles.td}>

                        <div
                          style={styles.contactCell}
                        >

                          <span>
                            ✉{" "}
                            {member.email}
                          </span>

                          <span>
                            ☎{" "}
                            {member.phone}
                          </span>

                        </div>

                      </td>


                      {/* TYPE */}

                      <td style={styles.td}>

                        <span style={styles.typeBadge}>
                          {member.membershipType ||
                            "student"}
                        </span>

                      </td>


                      {/* MEMBERSHIP DATE */}

                      <td style={styles.td}>

                        {member.membershipDate
                          ? new Date(
                              member.membershipDate
                            ).toLocaleDateString()
                          : "-"}

                      </td>


                      {/* EXPIRY DATE */}

                      <td style={styles.td}>

                        {member.expiryDate
                          ? new Date(
                              member.expiryDate
                            ).toLocaleDateString()
                          : "-"}

                      </td>


                      {/* STATUS */}

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(member.status ===
                            "active"
                              ? styles.activeBadge
                              : styles.inactiveBadge),
                          }}
                        >
                          <span
                            style={
                              styles.statusDot
                            }
                          ></span>

                          {member.status ||
                            "unknown"}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td style={styles.td}>

                        <div style={styles.actions}>

                          <Link
                            to={`/members/${member._id}`}
                            style={
                              styles.viewButton
                            }
                            title="View Member"
                          >
                            👁
                          </Link>

                          <Link
                            to={`/members/edit/${member._id}`}
                            style={
                              styles.editButton
                            }
                            title="Edit Member"
                          >
                            ✏
                          </Link>

                          <button
                            onClick={() =>
                              deleteMember(
                                member._id
                              )
                            }
                            style={
                              styles.deleteButton
                            }
                            title="Delete Member"
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* ================= QUICK NAVIGATION ================= */}

        <div style={styles.quickNavigation}>

          <Link
            to="/dashboard"
            style={styles.quickButton}
          >
            📊 Dashboard
          </Link>

          <Link
            to="/members/add"
            style={styles.quickButton}
          >
            ➕ Add Member
          </Link>

          <Link
            to="/books"
            style={styles.quickButton}
          >
            📚 Books
          </Link>

          <Link
            to="/borrowings"
            style={styles.quickButton}
          >
            🔄 Borrowings
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
      "rgba(255,255,255,0.95)",
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
    gap: "9px",
  },

  dashboardButton: {
    textDecoration: "none",
    padding: "10px 15px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: "700",
    fontSize: "12px",
  },

  addButton: {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "12px",
    boxShadow:
      "0 7px 18px rgba(79,70,229,0.22)",
  },

  container: {
    width: "90%",
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "35px 0 50px",
  },

  hero: {
    padding: "32px",
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

  smallTitle: {
    margin: "0 0 8px",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#c7d2fe",
  },

  pageTitle: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "850",
  },

  heroDescription: {
    margin: "9px 0 0",
    color: "#cbd5e1",
    fontSize: "13px",
  },

  heroIcon: {
    width: "70px",
    height: "70px",
    flexShrink: 0,
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.1)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    fontSize: "32px",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "11px",
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    fontSize: "12px",
    fontWeight: "600",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "11px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    fontSize: "12px",
    fontWeight: "600",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,minmax(0,1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "19px",
    borderRadius: "16px",
    background: "#ffffff",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "45px",
    height: "45px",
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
    margin: "4px 0 2px",
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "850",
  },

  statHint: {
    color: "#94a3b8",
    fontSize: "9px",
  },

  searchCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "23px",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
    marginBottom: "25px",
  },

  searchHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "17px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "17px",
    fontWeight: "800",
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  refreshButton: {
    border:
      "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#475569",
    padding: "10px 14px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "700",
  },

  searchArea: {
    display: "flex",
    gap: "10px",
  },

  searchInputWrapper: {
    flex: 1,
    height: "45px",
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#f8fafc",
    overflow: "hidden",
  },

  searchIcon: {
    width: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#0f172a",
    fontSize: "12px",
    minWidth: 0,
  },

  clearButton: {
    width: "35px",
    height: "100%",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "20px",
    cursor: "pointer",
  },

  searchButton: {
    border: "none",
    padding: "0 19px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    boxShadow:
      "0 7px 18px rgba(79,70,229,0.2)",
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: "18px",
    border:
      "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
    overflow: "hidden",
  },

  tableHeader: {
    padding: "21px 23px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    borderBottom:
      "1px solid #f1f5f9",
  },

  tableAddButton: {
    textDecoration: "none",
    padding: "9px 13px",
    borderRadius: "8px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "10px",
    fontWeight: "800",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "1050px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "13px 15px",
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
    padding: "14px 15px",
    color: "#475569",
    fontSize: "11px",
    verticalAlign: "middle",
  },

  memberCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "37px",
    height: "37px",
    flexShrink: 0,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#eef2ff,#ddd6fe)",
    color: "#4f46e5",
    fontSize: "14px",
    fontWeight: "850",
  },

  memberName: {
    display: "block",
    color: "#334155",
    fontSize: "11px",
  },

  memberId: {
    display: "block",
    marginTop: "3px",
    color: "#94a3b8",
    fontSize: "9px",
  },

  contactCell: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    color: "#64748b",
    fontSize: "10px",
  },

  typeBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "9px",
    fontWeight: "800",
    textTransform: "capitalize",
  },

  activeBadge: {
    background: "#ecfdf5",
    color: "#15803d",
  },

  inactiveBadge: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "currentColor",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  viewButton: {
    width: "31px",
    height: "31px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    borderRadius: "8px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "13px",
  },

  editButton: {
    width: "31px",
    height: "31px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    borderRadius: "8px",
    background: "#f0fdf4",
    color: "#15803d",
    fontSize: "13px",
  },

  deleteButton: {
    width: "31px",
    height: "31px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "8px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
    cursor: "pointer",
  },

  loadingArea: {
    padding: "60px 20px",
    textAlign: "center",
  },

  spinner: {
    width: "36px",
    height: "36px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    border:
      "4px solid #e2e8f0",
    borderTop:
      "4px solid #4f46e5",
  },

  loadingTitle: {
    margin: 0,
    color: "#334155",
    fontSize: "16px",
  },

  loadingText: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  emptyArea: {
    padding: "55px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "62px",
    height: "62px",
    margin: "0 auto 14px",
    borderRadius: "17px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    fontSize: "28px",
  },

  emptyTitle: {
    margin: 0,
    color: "#334155",
    fontSize: "17px",
  },

  emptyText: {
    margin: "6px 0 18px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  emptyButton: {
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
    marginTop: "22px",
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

export default Members;