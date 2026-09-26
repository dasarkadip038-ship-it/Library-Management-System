import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/books",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: search || undefined,
            category: category || undefined,
          },
        }
      );

      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Books Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load books"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, category]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >

      {/* ===============================
          NAVIGATION
      =============================== */}

      <Navigation />


      {/* ===============================
          HEADER
      =============================== */}

      <header
        style={{
          textAlign: "center",
          padding: "35px 20px 20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "800",
          }}
        >
          Library Management System
        </h1>

        <h2
          style={{
            marginTop: "8px",
            color: "#475569",
          }}
        >
          Books Management
        </h2>
      </header>


      {/* ===============================
          MAIN
      =============================== */}

      <main
        style={{
          width: "92%",
          maxWidth: "1300px",
          margin: "0 auto",
          paddingBottom: "50px",
        }}
      >

        {/* ===============================
            SEARCH / FILTER
        =============================== */}

        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "16px",
            boxShadow:
              "0 8px 25px rgba(15, 23, 42, 0.06)",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >

          <input
            type="text"
            placeholder="Search by title, author or ISBN"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              flex: 1,
              minWidth: "230px",
              padding: "12px 14px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <input
            type="text"
            placeholder="Filter by category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={{
              flex: 1,
              minWidth: "180px",
              padding: "12px 14px",
              borderRadius: "9px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <button
            onClick={fetchBooks}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "9px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#ffffff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>

        </div>


        {/* ===============================
            LOADING
        =============================== */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#ffffff",
              borderRadius: "16px",
            }}
          >
            <p>Loading books...</p>
          </div>
        )}


        {/* ===============================
            ERROR / MESSAGE
        =============================== */}

        {message && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "10px",
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            }}
          >
            ⚠️ {message}
          </div>
        )}


        {/* ===============================
            BOOK LIST
        =============================== */}

        {!loading && !message && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "25px",
              boxShadow:
                "0 10px 30px rgba(15, 23, 42, 0.06)",
              overflowX: "auto",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#6366f1",
                    fontSize: "11px",
                    fontWeight: "800",
                    letterSpacing: "1.5px",
                  }}
                >
                  LIBRARY COLLECTION
                </p>

                <h3
                  style={{
                    margin: "5px 0 0",
                    fontSize: "22px",
                  }}
                >
                  Total Books: {books.length}
                </h3>
              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
                style={{
                  padding: "9px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Clear Filters
              </button>
            </div>


            {books.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#64748b",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "10px",
                  }}
                >
                  📚
                </div>

                <p>
                  No books found.
                </p>
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "900px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f1f5f9",
                    }}
                  >
                    <th style={styles.th}>
                      ISBN
                    </th>

                    <th style={styles.th}>
                      Title
                    </th>

                    <th style={styles.th}>
                      Author
                    </th>

                    <th style={styles.th}>
                      Category
                    </th>

                    <th style={styles.th}>
                      Total Copies
                    </th>

                    <th style={styles.th}>
                      Available Copies
                    </th>

                    <th style={styles.th}>
                      Location
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      style={{
                        borderBottom:
                          "1px solid #e2e8f0",
                      }}
                    >

                      <td style={styles.td}>
                        {book.isbn}
                      </td>

                      <td
                        style={{
                          ...styles.td,
                          fontWeight: "700",
                        }}
                      >
                        {book.title}
                      </td>

                      <td style={styles.td}>
                        {book.author}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "5px 9px",
                            borderRadius: "20px",
                            background: "#eef2ff",
                            color: "#4338ca",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {book.category}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {book.totalCopies}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            color:
                              book.availableCopies > 0
                                ? "#15803d"
                                : "#dc2626",
                            fontWeight: "700",
                          }}
                        >
                          {book.availableCopies}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {book.location || "-"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "20px",
                            background:
                              book.status === "active"
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              book.status === "active"
                                ? "#166534"
                                : "#991b1b",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {book.status}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        )}

      </main>

    </div>
  );
}


/* ===============================
   TABLE STYLES
=============================== */

const styles = {
  th: {
    padding: "14px 12px",
    textAlign: "left",
    fontSize: "13px",
    color: "#475569",
    borderBottom:
      "2px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "15px 12px",
    fontSize: "13px",
    color: "#334155",
  },
};

export default Books;