import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await API.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const formatRole = (role) => {
    if (!role) return "-";

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div style={styles.page}>
      {/* Decorative Background */}
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
              My Profile
            </h1>

            <p style={styles.subtitle}>
              View your account information and library
              access details.
            </p>
          </div>

          <Link
            to="/dashboard"
            style={styles.dashboardButton}
          >
            ← Dashboard
          </Link>
        </div>

        {/* ERROR MESSAGE */}
        {message && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>!</div>

            <div>
              <strong>Profile Error</strong>

              <p style={styles.errorText}>
                {message}
              </p>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div style={styles.loadingCard}>
            <div style={styles.spinner}></div>

            <h3 style={styles.loadingTitle}>
              Loading Profile
            </h3>

            <p style={styles.loadingText}>
              Please wait while we fetch your account
              information...
            </p>
          </div>
        ) : !user ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>
              👤
            </div>

            <h3 style={styles.emptyTitle}>
              Profile Not Available
            </h3>

            <p style={styles.emptyText}>
              We could not load your profile information.
            </p>

            <Link
              to="/dashboard"
              style={styles.primaryButton}
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* PROFILE HERO */}
            <div style={styles.profileHero}>
              <div style={styles.avatar}>
                {getInitials(user.name)}
              </div>

              <div style={styles.profileHeroInfo}>
                <h2 style={styles.profileName}>
                  {user.name}
                </h2>

                <p style={styles.profileEmail}>
                  {user.email}
                </p>

                <div style={styles.heroBadges}>
                  <span style={styles.roleBadge}>
                    🛡️ {formatRole(user.role)}
                  </span>

                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        user.status === "active"
                          ? "#ecfdf5"
                          : "#fef2f2",
                      color:
                        user.status === "active"
                          ? "#15803d"
                          : "#dc2626",
                      borderColor:
                        user.status === "active"
                          ? "#bbf7d0"
                          : "#fecaca",
                    }}
                  >
                    ● {formatStatus(user.status)}
                  </span>
                </div>
              </div>

              <div style={styles.accountBox}>
                <span style={styles.accountLabel}>
                  ACCOUNT
                </span>

                <strong style={styles.accountValue}>
                  {user.status === "active"
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>
            </div>

            {/* INFORMATION CARDS */}
            <div style={styles.sectionTitle}>
              Account Information
            </div>

            <div style={styles.infoGrid}>

              {/* NAME */}
              <div style={styles.infoCard}>
                <div
                  style={{
                    ...styles.infoIcon,
                    background: "#eef2ff",
                  }}
                >
                  👤
                </div>

                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>
                    Full Name
                  </span>

                  <strong style={styles.infoValue}>
                    {user.name || "-"}
                  </strong>
                </div>
              </div>

              {/* EMAIL */}
              <div style={styles.infoCard}>
                <div
                  style={{
                    ...styles.infoIcon,
                    background: "#eff6ff",
                  }}
                >
                  ✉️
                </div>

                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>
                    Email Address
                  </span>

                  <strong style={styles.infoValue}>
                    {user.email || "-"}
                  </strong>
                </div>
              </div>

              {/* ROLE */}
              <div style={styles.infoCard}>
                <div
                  style={{
                    ...styles.infoIcon,
                    background: "#f5f3ff",
                  }}
                >
                  🛡️
                </div>

                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>
                    Account Role
                  </span>

                  <strong style={styles.infoValue}>
                    {formatRole(user.role)}
                  </strong>
                </div>
              </div>

              {/* STATUS */}
              <div style={styles.infoCard}>
                <div
                  style={{
                    ...styles.infoIcon,
                    background: "#ecfdf5",
                  }}
                >
                  ✓
                </div>

                <div style={styles.infoContent}>
                  <span style={styles.infoLabel}>
                    Account Status
                  </span>

                  <strong
                    style={{
                      ...styles.infoValue,
                      color:
                        user.status === "active"
                          ? "#15803d"
                          : "#dc2626",
                    }}
                  >
                    {formatStatus(user.status)}
                  </strong>
                </div>
              </div>

            </div>

            {/* ACCESS CARD */}
            <div style={styles.accessCard}>

              <div style={styles.accessIcon}>
                🔐
              </div>

              <div style={styles.accessContent}>
                <h3 style={styles.accessTitle}>
                  Account Access
                </h3>

                <p style={styles.accessText}>
                  Your account is currently configured
                  with{" "}
                  <strong>
                    {formatRole(user.role)}
                  </strong>{" "}
                  access.
                </p>
              </div>

              <div style={styles.accessStatus}>
                <span style={styles.accessDot}></span>

                Secure Session
              </div>

            </div>

            {/* QUICK ACTIONS */}
            <div style={styles.sectionTitle}>
              Quick Actions
            </div>

            <div style={styles.actionsGrid}>

              <Link
                to="/dashboard"
                style={styles.actionCard}
              >
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#eef2ff",
                  }}
                >
                  📊
                </div>

                <div>
                  <strong style={styles.actionTitle}>
                    Dashboard
                  </strong>

                  <p style={styles.actionText}>
                    View library statistics
                  </p>
                </div>

                <span style={styles.arrow}>
                  →
                </span>
              </Link>

              <Link
                to="/books"
                style={styles.actionCard}
              >
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#eff6ff",
                  }}
                >
                  📚
                </div>

                <div>
                  <strong style={styles.actionTitle}>
                    Books
                  </strong>

                  <p style={styles.actionText}>
                    Browse library books
                  </p>
                </div>

                <span style={styles.arrow}>
                  →
                </span>
              </Link>

              <Link
                to="/borrowings"
                style={styles.actionCard}
              >
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#fff7ed",
                  }}
                >
                  🔄
                </div>

                <div>
                  <strong style={styles.actionTitle}>
                    Borrowings
                  </strong>

                  <p style={styles.actionText}>
                    Manage book transactions
                  </p>
                </div>

                <span style={styles.arrow}>
                  →
                </span>
              </Link>

              <Link
                to="/members"
                style={styles.actionCard}
              >
                <div
                  style={{
                    ...styles.actionIcon,
                    background: "#ecfdf5",
                  }}
                >
                  👥
                </div>

                <div>
                  <strong style={styles.actionTitle}>
                    Members
                  </strong>

                  <p style={styles.actionText}>
                    Manage library members
                  </p>
                </div>

                <span style={styles.arrow}>
                  →
                </span>
              </Link>

            </div>

          </>
        )}

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
    maxWidth: "1180px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  glowOne: {
    position: "fixed",
    width: "380px",
    height: "380px",
    borderRadius: "50%",
    background:
      "rgba(99,102,241,0.08)",
    filter: "blur(90px)",
    top: "-130px",
    right: "-100px",
  },

  glowTwo: {
    position: "fixed",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background:
      "rgba(14,165,233,0.06)",
    filter: "blur(85px)",
    bottom: "-100px",
    left: "-100px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "25px",
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
    background: "#ffffff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "12px 18px",
    borderRadius: "11px",
    fontSize: "13px",
    fontWeight: "750",
    boxShadow:
      "0 6px 18px rgba(15,23,42,0.05)",
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

  errorText: {
    margin: "4px 0 0",
    fontSize: "13px",
  },

  loadingCard: {
    minHeight: "380px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.06)",
  },

  spinner: {
    width: "42px",
    height: "42px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },

  loadingTitle: {
    margin: "18px 0 5px",
    fontSize: "19px",
    fontWeight: "800",
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  emptyCard: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "70px 25px",
    textAlign: "center",
    boxShadow:
      "0 15px 40px rgba(15,23,42,0.06)",
  },

  emptyIcon: {
    width: "72px",
    height: "72px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
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
  },

  primaryButton: {
    display: "inline-block",
    textDecoration: "none",
    background:
      "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#fff",
    padding: "11px 18px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "750",
    boxShadow:
      "0 8px 20px rgba(79,70,229,0.2)",
  },

  profileHero: {
    background:
      "linear-gradient(135deg, #312e81, #4f46e5 55%, #6366f1)",
    borderRadius: "23px",
    padding: "30px",
    display: "flex",
    alignItems: "center",
    gap: "22px",
    color: "#fff",
    boxShadow:
      "0 20px 45px rgba(79,70,229,0.22)",
    marginBottom: "30px",
    position: "relative",
    overflow: "hidden",
    flexWrap: "wrap",
  },

  avatar: {
    width: "88px",
    height: "88px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.16)",
    border: "2px solid rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "850",
    flexShrink: 0,
    backdropFilter: "blur(10px)",
  },

  profileHeroInfo: {
    flex: 1,
    minWidth: "230px",
  },

  profileName: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "850",
    letterSpacing: "-0.5px",
  },

  profileEmail: {
    margin: "6px 0 14px",
    color: "rgba(255,255,255,0.75)",
    fontSize: "14px",
  },

  heroBadges: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  roleBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "7px 10px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
  },

  statusBadge: {
    display: "inline-block",
    padding: "7px 10px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
    border: "1px solid",
  },

  accountBox: {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "15px",
    padding: "14px 18px",
    minWidth: "125px",
    backdropFilter: "blur(10px)",
  },

  accountLabel: {
    display: "block",
    fontSize: "9px",
    letterSpacing: "1px",
    fontWeight: "800",
    color: "rgba(255,255,255,0.65)",
    marginBottom: "5px",
  },

  accountValue: {
    fontSize: "16px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "850",
    marginBottom: "15px",
    color: "#172033",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "25px",
  },

  infoCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.04)",
  },

  infoIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    flexShrink: 0,
  },

  infoContent: {
    minWidth: 0,
  },

  infoLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "5px",
  },

  infoValue: {
    display: "block",
    color: "#1e293b",
    fontSize: "14px",
    wordBreak: "break-word",
  },

  accessCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.04)",
    flexWrap: "wrap",
  },

  accessIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  accessContent: {
    flex: 1,
    minWidth: "220px",
  },

  accessTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
  },

  accessText: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "12px",
  },

  accessStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#15803d",
    background: "#ecfdf5",
    border: "1px solid #bbf7d0",
    padding: "8px 11px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
  },

  accessDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  actionCard: {
    textDecoration: "none",
    color: "inherit",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "17px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.04)",
  },

  actionIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  actionTitle: {
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
  },

  actionText: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "11px",
  },

  arrow: {
    marginLeft: "auto",
    color: "#94a3b8",
    fontSize: "19px",
    fontWeight: "700",
  },
};

export default Profile;