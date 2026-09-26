import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "",
    publisher: "",
    publicationYear: "",
    description: "",
    totalCopies: "",
    location: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://127.0.0.1:5000/api/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const book = response.data.book;

      setFormData({
        isbn: book.isbn || "",
        title: book.title || "",
        author: book.author || "",
        category: book.category || "",
        publisher: book.publisher || "",
        publicationYear: book.publicationYear || "",
        description: book.description || "",
        totalCopies: book.totalCopies ?? "",
        location: book.location || ""
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load book"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);

      const response = await axios.put(
        `http://127.0.0.1:5000/api/books/${id}`,
        {
          isbn: formData.isbn,
          title: formData.title,
          author: formData.author,
          category: formData.category,
          publisher: formData.publisher,
          publicationYear: formData.publicationYear
            ? Number(formData.publicationYear)
            : undefined,
          description: formData.description,
          totalCopies: Number(formData.totalCopies),
          location: formData.location
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        response.data.message ||
          "Book updated successfully"
      );

      setTimeout(() => {
        navigate("/books");
      }, 800);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update book"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>

          <h2 style={styles.loadingTitle}>
            Loading Book
          </h2>

          <p style={styles.loadingText}>
            Please wait while book details are loaded...
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
              Book Management
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
              BOOK MANAGEMENT
            </p>

            <h2 style={styles.pageTitle}>
              Edit Book
            </h2>

            <p style={styles.description}>
              Update the information of this library book.
            </p>

          </div>

          <div style={styles.heroIcon}>
            ✏️
          </div>

        </section>


        {/* MESSAGE */}

        {message && (
          <div style={styles.successMessage}>
            ✅ {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}


        {/* ================= FORM CARD ================= */}

        <section style={styles.formCard}>

          <div style={styles.formHeader}>

            <div style={styles.formHeaderIcon}>
              📖
            </div>

            <div>
              <h3 style={styles.formTitle}>
                Book Information
              </h3>

              <p style={styles.formSubtitle}>
                Update the details below and save your
                changes.
              </p>
            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* ISBN */}

              <div style={styles.field}>
                <label style={styles.label}>
                  ISBN *
                </label>

                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter ISBN"
                />
              </div>


              {/* Title */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Book Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter book title"
                />
              </div>


              {/* Author */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Author *
                </label>

                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter author name"
                />
              </div>


              {/* Category */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Enter category"
                />
              </div>


              {/* Publisher */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Publisher
                </label>

                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter publisher"
                />
              </div>


              {/* Publication Year */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Publication Year
                </label>

                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. 2024"
                  min="0"
                />
              </div>


              {/* Total Copies */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Total Copies *
                </label>

                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  min="0"
                  required
                  style={styles.input}
                  placeholder="Enter total copies"
                />
              </div>


              {/* Location */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Library Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. Shelf A-01"
                />
              </div>


              {/* Description */}

              <div
                style={{
                  ...styles.field,
                  gridColumn: "1 / -1"
                }}
              >

                <label style={styles.label}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  style={{
                    ...styles.input,
                    resize: "vertical",
                    minHeight: "120px"
                  }}
                  placeholder="Enter book description"
                />

              </div>

            </div>


            {/* FORM ACTIONS */}

            <div style={styles.formActions}>

              <button
                type="button"
                onClick={() => navigate("/books")}
                style={styles.cancelButton}
                disabled={saving}
              >
                ← Cancel
              </button>

              <button
                type="submit"
                style={styles.updateButton}
                disabled={saving}
              >
                {saving
                  ? "Updating..."
                  : "✓ Update Book"}
              </button>

            </div>

          </form>

        </section>


        {/* ================= QUICK NAVIGATION ================= */}

        <div style={styles.quickNavigation}>

          <Link
            to="/books"
            style={styles.quickButton}
          >
            📚 All Books
          </Link>

          <Link
            to="/books/add"
            style={styles.quickButton}
          >
            ➕ Add New Book
          </Link>

          <Link
            to="/categories"
            style={styles.quickButton}
          >
            🗂️ Categories
          </Link>

        </div>

      </main>

    </div>
  );
};


/* =================================================
   PREMIUM INLINE STYLES
   No Extra CSS File Required
================================================= */

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff,#f8fafc)",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif",
    color: "#0f172a"
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg,#eef2ff,#f8fafc)",
    fontFamily:
      "Inter,Arial,Helvetica,sans-serif"
  },

  loadingCard: {
    background: "#ffffff",
    padding: "45px",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(15,23,42,0.12)"
  },

  spinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    borderRadius: "50%",
    border: "4px solid #e2e8f0",
    borderTop:
      "4px solid #4f46e5"
  },

  loadingTitle: {
    margin: "18px 0 5px",
    fontSize: "20px"
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px"
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
    zIndex: 100
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "13px"
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
      "0 8px 20px rgba(79,70,229,0.25)"
  },

  brandTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800"
  },

  brandSubtitle: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "12px"
  },

  dashboardButton: {
    textDecoration: "none",
    padding: "10px 17px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: "700",
    fontSize: "13px"
  },

  container: {
    width: "90%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 0"
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
    marginBottom: "25px"
  },

  smallTitle: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#c7d2fe"
  },

  pageTitle: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "850"
  },

  description: {
    margin: "9px 0 0",
    color: "#cbd5e1",
    fontSize: "14px"
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
    fontSize: "30px"
  },

  successMessage: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
    fontSize: "13px",
    fontWeight: "600"
  },

  errorMessage: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    fontSize: "13px",
    fontWeight: "600"
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.06)"
  },

  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    paddingBottom: "22px",
    marginBottom: "25px",
    borderBottom:
      "1px solid #f1f5f9"
  },

  formHeaderIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    fontSize: "21px"
  },

  formTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "800"
  },

  formSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px"
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",
    gap: "20px"
  },

  field: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    marginBottom: "7px",
    color: "#334155",
    fontSize: "12px",
    fontWeight: "700"
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "13px"
  },

  formActions: {
    marginTop: "28px",
    paddingTop: "22px",
    borderTop:
      "1px solid #f1f5f9",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },

  cancelButton: {
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700"
  },

  updateButton: {
    border: "none",
    cursor: "pointer",
    padding: "12px 20px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow:
      "0 7px 18px rgba(79,70,229,0.22)"
  },

  quickNavigation: {
    marginTop: "22px",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },

  quickButton: {
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: "10px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700"
  }
};

export default EditBook;