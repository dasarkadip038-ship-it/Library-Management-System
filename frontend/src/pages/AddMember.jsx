import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navigation from "../components/Navigation";

function AddMember() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    memberId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "student",
    membershipDate: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await API.post("/members", formData);

      setMessage("Member added successfully!");

      setTimeout(() => {
        navigate("/members");
      }, 800);
    } catch (error) {
      console.error("Add Member Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ===============================
          NAVIGATION
      =============================== */}

      <Navigation />


      {/* ===============================
          HEADER
      =============================== */}

      <header style={styles.header}>

        <p style={styles.smallTitle}>
          LIBRARY MANAGEMENT
        </p>

        <h1 style={styles.title}>
          Add New Member
        </h1>

        <p style={styles.subtitle}>
          Register a new member in the library system.
        </p>

      </header>


      {/* ===============================
          MAIN
      =============================== */}

      <main style={styles.container}>

        <div style={styles.formCard}>

          {/* CARD HEADER */}

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Member Information
              </h2>

              <p style={styles.cardSubtitle}>
                Enter the member's details below.
              </p>
            </div>

            <div style={styles.memberIcon}>
              👤
            </div>

          </div>


          {/* MESSAGE */}

          {message && (
            <div
              style={
                message.includes("successfully")
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {message.includes("successfully")
                ? "✅"
                : "⚠️"}{" "}
              {message}
            </div>
          )}


          {/* ===============================
              FORM
          =============================== */}

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* MEMBER ID */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Member ID *
                </label>

                <input
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  placeholder="Enter member ID"
                  required
                  style={styles.input}
                />

              </div>


              {/* NAME */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Full Name *
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  required
                  style={styles.input}
                />

              </div>


              {/* EMAIL */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  style={styles.input}
                />

              </div>


              {/* PHONE */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Phone *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  style={styles.input}
                />

              </div>


              {/* MEMBERSHIP TYPE */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Membership Type
                </label>

                <select
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="faculty">
                    Faculty
                  </option>

                  <option value="staff">
                    Staff
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>


              {/* MEMBERSHIP DATE */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Membership Date
                </label>

                <input
                  type="date"
                  name="membershipDate"
                  value={formData.membershipDate}
                  onChange={handleChange}
                  style={styles.input}
                />

              </div>


              {/* EXPIRY DATE */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  style={styles.input}
                />

              </div>

            </div>


            {/* ADDRESS */}

            <div style={styles.formGroup}>

              <label style={styles.label}>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter member address"
                rows="5"
                style={styles.textarea}
              />

            </div>


            {/* ===============================
                BUTTONS
            =============================== */}

            <div style={styles.buttonArea}>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.primaryButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? "Adding Member..."
                  : "➕ Add Member"}
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/members")
                }
                style={styles.secondaryButton}
              >
                👥 Back to Members
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                style={styles.dashboardButton}
              >
                🏠 Dashboard
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}


/* =================================================
   INLINE STYLES
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

  header: {
    textAlign: "center",
    padding: "40px 20px 25px",
  },

  smallTitle: {
    margin: 0,
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  title: {
    margin: "8px 0",
    fontSize: "34px",
    fontWeight: "850",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  container: {
    width: "92%",
    maxWidth: "1050px",
    margin: "0 auto",
    paddingBottom: "50px",
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.08)",
    border:
      "1px solid rgba(226, 232, 240, 0.8)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  cardTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  memberIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "25px",
    background: "#eef2ff",
  },

  successMessage: {
    padding: "13px 16px",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#f0fdf4",
    color: "#166534",
    border:
      "1px solid #bbf7d0",
    fontSize: "14px",
    fontWeight: "600",
  },

  errorMessage: {
    padding: "13px 16px",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#991b1b",
    border:
      "1px solid #fecaca",
    fontSize: "14px",
    fontWeight: "600",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  formGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "700",
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  buttonArea: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    paddingTop: "5px",
  },

  primaryButton: {
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow:
      "0 8px 18px rgba(79, 70, 229, 0.2)",
  },

  secondaryButton: {
    border: "1px solid #cbd5e1",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  dashboardButton: {
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
};

export default AddMember;