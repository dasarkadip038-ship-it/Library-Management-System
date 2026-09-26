import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // ===============================
      // SAVE TOKEN
      // ===============================

      localStorage.setItem(
        "token",
        response.data.token
      );

      // ===============================
      // SAVE USER
      // ===============================

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      console.log(
        "Login Response:",
        response.data
      );

      setMessage("Login successful!");
      setMessageType("success");

      // ===============================
      // GET USER ROLE
      // ===============================

      const role =
        response.data.user?.role?.toLowerCase();

      console.log("User Role:", role);

      // ===============================
      // ROLE BASED REDIRECT
      // ===============================

      setTimeout(() => {
        if (role === "member") {
          // Member → Member Dashboard
          window.location.href =
            "/member-dashboard";
        } else {
          // Admin → Admin Dashboard
          window.location.href =
            "/dashboard";
        }
      }, 500);

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );

      setMessageType("error");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ===============================
          LEFT SIDE
      =============================== */}

      <div style={styles.leftPanel}>

        <div style={styles.leftContent}>

          <div style={styles.logo}>
            📚
          </div>

          <h1 style={styles.systemTitle}>
            Library Management
            <br />
            System
          </h1>

          <p style={styles.systemDescription}>
            Manage books, members and borrowing
            activities from one powerful platform.
          </p>

          {/* FEATURES */}

          <div style={styles.features}>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                📖
              </div>

              <div>
                <strong style={styles.featureTitle}>
                  Book Management
                </strong>

                <span style={styles.featureText}>
                  Manage your complete library
                  collection.
                </span>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                👥
              </div>

              <div>
                <strong style={styles.featureTitle}>
                  Member Management
                </strong>

                <span style={styles.featureText}>
                  Manage active library members.
                </span>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={styles.featureIcon}>
                🔄
              </div>

              <div>
                <strong style={styles.featureTitle}>
                  Borrowing Management
                </strong>

                <span style={styles.featureText}>
                  Track issued and returned books.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ===============================
          RIGHT SIDE
      =============================== */}

      <div style={styles.rightPanel}>

        <div style={styles.loginCard}>

          {/* HEADER */}

          <div style={styles.cardHeader}>

            <div style={styles.mobileLogo}>
              📚
            </div>

            <p style={styles.welcome}>
              WELCOME BACK
            </p>

            <h2 style={styles.loginTitle}>
              Sign in to your account
            </h2>

            <p style={styles.loginSubtitle}>
              Enter your credentials to continue.
            </p>

          </div>

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

          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div style={styles.formGroup}>

              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  style={styles.input}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div style={styles.formGroup}>

              <div style={styles.passwordLabelRow}>

                <label style={styles.label}>
                  Password
                </label>

              </div>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  style={styles.passwordInput}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  style={styles.eyeButton}
                  tabIndex="-1"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >

              {loading ? (
                <>
                  <span style={styles.buttonSpinner}></span>
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <span style={styles.arrow}>
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* REGISTER */}

          <div style={styles.registerSection}>

            <span style={styles.registerText}>
              Don't have an account?
            </span>

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create Account
            </Link>

          </div>

          {/* SECURITY */}

          <div style={styles.security}>

            <span style={styles.securityIcon}>
              🔐
            </span>

            <span>
              Secure authentication powered by
              JWT
            </span>

          </div>

        </div>

      </div>

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
    display: "flex",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif",
    background: "#f8fafc",
  },

  /* ================= LEFT PANEL ================= */

  leftPanel: {
    width: "48%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px",
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg,#111827,#312e81,#4338ca)",
    position: "relative",
    overflow: "hidden",
  },

  leftContent: {
    width: "100%",
    maxWidth: "500px",
    position: "relative",
    zIndex: 2,
  },

  logo: {
    width: "68px",
    height: "68px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.18)",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.2)",
    marginBottom: "28px",
  },

  systemTitle: {
    color: "#ffffff",
    fontSize: "44px",
    lineHeight: "1.12",
    margin: 0,
    fontWeight: "850",
    letterSpacing: "-1px",
  },

  systemDescription: {
    color: "#cbd5e1",
    fontSize: "15px",
    lineHeight: "1.7",
    maxWidth: "430px",
    marginTop: "20px",
  },

  features: {
    marginTop: "45px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  featureIcon: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.1)",
    border:
      "1px solid rgba(255,255,255,0.12)",
    fontSize: "20px",
  },

  featureTitle: {
    display: "block",
    color: "#ffffff",
    fontSize: "13px",
    marginBottom: "4px",
  },

  featureText: {
    display: "block",
    color: "#a5b4fc",
    fontSize: "11px",
  },

  /* ================= RIGHT PANEL ================= */

  rightPanel: {
    width: "52%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",
  },

  loginCard: {
    width: "100%",
    maxWidth: "455px",
    padding: "42px",
    boxSizing: "border-box",
    background: "#ffffff",
    borderRadius: "24px",
    border:
      "1px solid rgba(226,232,240,0.8)",
    boxShadow:
      "0 25px 70px rgba(15,23,42,0.12)",
  },

  cardHeader: {
    marginBottom: "28px",
  },

  mobileLogo: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    fontSize: "22px",
    marginBottom: "20px",
  },

  welcome: {
    margin: 0,
    color: "#6366f1",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  loginTitle: {
    margin: "8px 0 7px",
    color: "#0f172a",
    fontSize: "29px",
    fontWeight: "850",
    letterSpacing: "-0.5px",
  },

  loginSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 14px",
    marginBottom: "20px",
    borderRadius: "10px",
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
    padding: "12px 14px",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    fontSize: "12px",
    fontWeight: "600",
  },

  formGroup: {
    marginBottom: "19px",
  },

  passwordLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    display: "block",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  inputWrapper: {
    width: "100%",
    height: "48px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    border:
      "1px solid #cbd5e1",
    borderRadius: "11px",
    background: "#f8fafc",
    overflow: "hidden",
  },

  inputIcon: {
    width: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "15px",
  },

  input: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "0 13px 0 0",
    color: "#0f172a",
    fontSize: "13px",
    minWidth: 0,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "0 5px 0 0",
    color: "#0f172a",
    fontSize: "13px",
    minWidth: 0,
  },

  eyeButton: {
    width: "42px",
    height: "100%",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "15px",
  },

  loginButton: {
    width: "100%",
    height: "50px",
    marginTop: "7px",
    border: "none",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    boxShadow:
      "0 10px 25px rgba(79,70,229,0.25)",
  },

  arrow: {
    fontSize: "18px",
  },

  buttonSpinner: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    border:
      "2px solid rgba(255,255,255,0.4)",
    borderTop:
      "2px solid #ffffff",
  },

  registerSection: {
    marginTop: "25px",
    paddingTop: "22px",
    borderTop:
      "1px solid #f1f5f9",
    textAlign: "center",
    fontSize: "12px",
  },

  registerText: {
    color: "#64748b",
    marginRight: "6px",
  },

  registerLink: {
    color: "#4f46e5",
    fontWeight: "800",
    textDecoration: "none",
  },

  security: {
    marginTop: "20px",
    padding: "11px 13px",
    borderRadius: "9px",
    background: "#f8fafc",
    color: "#94a3b8",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  securityIcon: {
    fontSize: "12px",
  },
};

export default Login;