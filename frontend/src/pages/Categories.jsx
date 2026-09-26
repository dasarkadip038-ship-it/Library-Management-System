import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await API.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load categories"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name is required");
      setMessageType("error");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, {
          name: name.trim(),
        });

        setMessage("Category updated successfully");
      } else {
        await API.post("/categories", {
          name: name.trim(),
        });

        setMessage("Category added successfully");
      }

      setMessageType("success");
      setName("");
      setEditingId(null);

      fetchCategories();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Category operation failed"
      );
      setMessageType("error");
    }
  };

  const editCategory = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setMessage("");
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/categories/${id}`);

      setMessage(
        "Category deleted successfully"
      );
      setMessageType("success");

      fetchCategories();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete category"
      );
      setMessageType("error");
    }
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
              Category Management
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
              LIBRARY ORGANIZATION
            </p>

            <h2 style={styles.pageTitle}>
              Categories Management
            </h2>

            <p style={styles.description}>
              Create, update and manage book categories
              for your library.
            </p>
          </div>

          <div style={styles.categoryCount}>
            <span style={styles.countIcon}>
              🗂️
            </span>

            <div>
              <small style={styles.countLabel}>
                TOTAL CATEGORIES
              </small>

              <strong style={styles.countValue}>
                {categories.length}
              </strong>
            </div>
          </div>

        </section>


        {/* MESSAGE */}

        {message && (
          <div
            style={{
              ...styles.messageBox,
              background:
                messageType === "error"
                  ? "#fef2f2"
                  : "#f0fdf4",
              color:
                messageType === "error"
                  ? "#991b1b"
                  : "#166534",
              borderColor:
                messageType === "error"
                  ? "#fecaca"
                  : "#bbf7d0",
            }}
          >
            {messageType === "error"
              ? "⚠️"
              : "✅"}{" "}
            {message}
          </div>
        )}


        {/* ================= FORM ================= */}

        <section style={styles.formCard}>

          <div style={styles.formHeader}>

            <div
              style={{
                ...styles.formIcon,
                background: editingId
                  ? "#fff7ed"
                  : "#eef2ff",
              }}
            >
              {editingId ? "✏️" : "➕"}
            </div>

            <div>
              <h3 style={styles.formTitle}>
                {editingId
                  ? "Update Category"
                  : "Add New Category"}
              </h3>

              <p style={styles.formSubtitle}>
                {editingId
                  ? "Modify the selected category name"
                  : "Create a new category for your books"}
              </p>
            </div>

          </div>


          <form
            onSubmit={saveCategory}
            style={styles.form}
          >

            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Category Name
              </label>

              <input
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={styles.input}
              />

            </div>


            <div style={styles.formButtons}>

              <button
                type="submit"
                style={styles.primaryButton}
              >
                {editingId
                  ? "✓ Update Category"
                  : "+ Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>


        {/* ================= CATEGORY LIST ================= */}

        <section style={styles.tableCard}>

          <div style={styles.tableHeader}>

            <div>
              <p style={styles.sectionSmall}>
                CATEGORY DIRECTORY
              </p>

              <h3 style={styles.tableTitle}>
                All Categories
              </h3>
            </div>

            <span style={styles.recordBadge}>
              {categories.length} Categories
            </span>

          </div>


          {loading ? (
            <div style={styles.loading}>

              <div style={styles.spinner}></div>

              <p>
                Loading categories...
              </p>

            </div>
          ) : categories.length === 0 ? (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                🗂️
              </div>

              <h3>
                No Categories Found
              </h3>

              <p>
                Add your first category using the
                form above.
              </p>

            </div>
          ) : (
            <div style={styles.categoryGrid}>

              {categories.map(
                (category, index) => (
                  <div
                    key={category._id}
                    style={styles.categoryCard}
                  >

                    <div style={styles.categoryLeft}>

                      <div
                        style={
                          styles.categoryIcon
                        }
                      >
                        📚
                      </div>

                      <div>

                        <span
                          style={
                            styles.categoryNumber
                          }
                        >
                          CATEGORY{" "}
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h4
                          style={
                            styles.categoryName
                          }
                        >
                          {category.name}
                        </h4>

                      </div>

                    </div>


                    <div
                      style={
                        styles.categoryActions
                      }
                    >

                      <button
                        type="button"
                        onClick={() =>
                          editCategory(category)
                        }
                        style={
                          styles.editButton
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCategory(
                            category._id
                          )
                        }
                        style={
                          styles.deleteButton
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>


        {/* ================= NAVIGATION ================= */}

        <div style={styles.bottomNavigation}>

          <Link
            to="/dashboard"
            style={styles.secondaryButton}
          >
            ← Dashboard
          </Link>

          <Link
            to="/books"
            style={styles.secondaryButton}
          >
            📚 Books
          </Link>

          <Link
            to="/members"
            style={styles.secondaryButton}
          >
            👥 Members
          </Link>

          <Link
            to="/borrowings"
            style={styles.secondaryButton}
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
   No Extra CSS File Required
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
    maxWidth: "1300px",
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

  description: {
    margin: "9px 0 0",
    color: "#cbd5e1",
    fontSize: "14px",
  },

  categoryCount: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,0.1)",
    border:
      "1px solid rgba(255,255,255,0.15)",
  },

  countIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.12)",
    fontSize: "20px",
  },

  countLabel: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "9px",
    letterSpacing: "1px",
  },

  countValue: {
    display: "block",
    marginTop: "3px",
    fontSize: "24px",
  },

  messageBox: {
    marginBottom: "20px",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1px solid",
    fontSize: "13px",
    fontWeight: "600",
  },

  formCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "25px",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.06)",
    marginBottom: "25px",
  },

  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "22px",
  },

  formIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  formTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
  },

  formSubtitle: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: "12px",
  },

  form: {
    display: "flex",
    alignItems: "flex-end",
    gap: "14px",
    flexWrap: "wrap",
  },

  inputGroup: {
    flex: "1 1 350px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
  },

  formButtons: {
    display: "flex",
    gap: "8px",
  },

  primaryButton: {
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#4f46e5,#6366f1)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
  },

  cancelButton: {
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    padding: "12px 17px",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
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
    borderBottom:
      "1px solid #e2e8f0",
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

  recordBadge: {
    padding: "8px 13px",
    borderRadius: "20px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
  },

  categoryGrid: {
    padding: "20px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(330px,1fr))",
    gap: "14px",
  },

  categoryCard: {
    padding: "17px",
    borderRadius: "15px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    boxShadow:
      "0 5px 15px rgba(15,23,42,0.04)",
  },

  categoryLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  categoryIcon: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2ff",
    fontSize: "20px",
  },

  categoryNumber: {
    display: "block",
    color: "#94a3b8",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  categoryName: {
    margin: "4px 0 0",
    fontSize: "15px",
    fontWeight: "800",
    wordBreak: "break-word",
  },

  categoryActions: {
    display: "flex",
    gap: "6px",
    flexShrink: 0,
  },

  editButton: {
    border: "none",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: "8px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "11px",
    fontWeight: "700",
  },

  deleteButton: {
    border: "none",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: "8px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "11px",
    fontWeight: "700",
  },

  loading: {
    minHeight: "250px",
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
    borderTop:
      "4px solid #4f46e5",
    marginBottom: "15px",
  },

  emptyState: {
    padding: "60px 20px",
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

  bottomNavigation: {
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
};

export default Categories;