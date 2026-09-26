import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";

function AddBook() {
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
    availableCopies: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const totalCopies = Number(
        formData.totalCopies
      );

      const availableCopies = Number(
        formData.availableCopies
      );

      if (availableCopies > totalCopies) {
        setError(
          "Available copies cannot be greater than total copies."
        );
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/books",
        {
          isbn: formData.isbn.trim(),
          title: formData.title.trim(),
          author: formData.author.trim(),
          category: formData.category.trim(),
          publisher: formData.publisher.trim(),
          publicationYear:
            formData.publicationYear
              ? Number(formData.publicationYear)
              : undefined,
          description:
            formData.description.trim(),
          totalCopies,
          availableCopies,
          location: formData.location.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Add Book Response:",
        response.data
      );

      setMessage(
        "Book added successfully!"
      );

      setFormData({
        isbn: "",
        title: "",
        author: "",
        category: "",
        publisher: "",
        publicationYear: "",
        description: "",
        totalCopies: "",
        availableCopies: "",
        location: "",
      });

    } catch (error) {
      console.error(
        "Add Book Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to add book"
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
          Add New Book
        </h1>

        <p style={styles.subtitle}>
          Add a new book to the library collection.
        </p>

      </header>


      {/* ===============================
          MAIN
      =============================== */}

      <main style={styles.container}>

        {/* ===============================
            FORM CARD
        =============================== */}

        <div style={styles.formCard}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Book Information
              </h2>

              <p style={styles.cardSubtitle}>
                Enter the details of the new book.
              </p>
            </div>

            <div style={styles.bookIcon}>
              📚
            </div>

          </div>


          {/* ===============================
              MESSAGE
          =============================== */}

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


          {/* ===============================
              FORM
          =============================== */}

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* ISBN */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  ISBN *
                </label>

                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                  required
                  style={styles.input}
                />
              </div>


              {/* TITLE */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Book Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                  style={styles.input}
                />
              </div>


              {/* AUTHOR */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Author *
                </label>

                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                  style={styles.input}
                />
              </div>


              {/* CATEGORY */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  required
                  style={styles.input}
                />
              </div>


              {/* PUBLISHER */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Publisher
                </label>

                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Enter publisher"
                  style={styles.input}
                />
              </div>


              {/* PUBLICATION YEAR */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Publication Year
                </label>

                <input
                  type="number"
                  name="publicationYear"
                  value={
                    formData.publicationYear
                  }
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  min="0"
                  style={styles.input}
                />
              </div>


              {/* TOTAL COPIES */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Total Copies *
                </label>

                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  placeholder="Enter total copies"
                  min="0"
                  required
                  style={styles.input}
                />
              </div>


              {/* AVAILABLE COPIES */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Available Copies *
                </label>

                <input
                  type="number"
                  name="availableCopies"
                  value={
                    formData.availableCopies
                  }
                  onChange={handleChange}
                  placeholder="Enter available copies"
                  min="0"
                  required
                  style={styles.input}
                />
              </div>


              {/* LOCATION */}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Shelf B-02"
                  style={styles.input}
                />
              </div>

            </div>


            {/* DESCRIPTION */}

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description"
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
                  ? "Adding Book..."
                  : "➕ Add Book"}
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/books")
                }
                style={styles.secondaryButton}
              >
                📚 Back to Books
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

  bookIcon: {
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

export default AddBook;