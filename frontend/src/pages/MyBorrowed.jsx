import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import API from "../services/api";

function MyBorrowed() {
  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [borrowings, setBorrowings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyBorrowedBooks();
  }, []);

  const loadMyBorrowedBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (!storedUser) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      setUser(storedUser);

      // -----------------------------------------
      // 1. Find library member using login email
      // -----------------------------------------
      const membersResponse = await API.get("/members");

      const membersData = membersResponse.data;

      const members = Array.isArray(membersData)
        ? membersData
        : membersData.members || [];

      const foundMember = members.find(
        (item) =>
          item.email?.toLowerCase() === storedUser.email?.toLowerCase()
      );

      if (!foundMember) {
        setError(
          "No library member profile found for this account."
        );
        setLoading(false);
        return;
      }

      setMember(foundMember);

      // -----------------------------------------
      // 2. Get member borrowings
      // -----------------------------------------
      const borrowingResponse = await API.get(
        `/borrowings/member/${foundMember.memberId}`
      );

      const borrowingData = borrowingResponse.data;

      const allBorrowings = Array.isArray(borrowingData)
        ? borrowingData
        : borrowingData.borrowings || [];

      // Only currently active books
      const activeBorrowings = allBorrowings.filter(
        (item) =>
          item.status?.toLowerCase() === "borrowed" ||
          item.status?.toLowerCase() === "overdue"
      );

      setBorrowings(activeBorrowings);
    } catch (err) {
      console.error("My Borrowed Books Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load borrowed books."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === "overdue") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    return {
      background: "#dcfce7",
      color: "#166534",
    };
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
        }}
      >
        <Navigation />

        <div
          style={{
            padding: "70px 20px",
            textAlign: "center",
            fontSize: "18px",
            color: "#475569",
          }}
        >
          📚 Loading your borrowed books...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        color: "#0f172a",
      }}
    >
      <Navigation />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "35px 20px 60px",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #071a3d, #174ea6)",
            borderRadius: "24px",
            padding: "40px",
            color: "#fff",
            marginBottom: "25px",
            boxShadow: "0 12px 30px rgba(7,26,61,0.18)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "2px",
              opacity: 0.8,
              marginBottom: "10px",
            }}
          >
            MEMBER LIBRARY
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "36px",
            }}
          >
            My Borrowed Books
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "16px",
              opacity: 0.85,
            }}
          >
            View the books currently issued to your library account.
          </p>

          {member && (
            <div
              style={{
                display: "inline-block",
                marginTop: "22px",
                padding: "10px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              🪪 Member ID: {member.memberId}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              borderRadius: "14px",
              padding: "18px 20px",
              marginBottom: "25px",
            }}
          >
            <strong>⚠️ Unable to load borrowed books</strong>
            <div style={{ marginTop: "6px" }}>{error}</div>
          </div>
        )}

        {/* Welcome */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "27px",
              }}
            >
              Hello, {member?.name || user?.name || "Member"} 👋
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "#64748b",
              }}
            >
              Here are your currently borrowed books.
            </p>
          </div>

          <button
            onClick={loadMyBorrowedBooks}
            style={{
              border: "1px solid #dbe3ef",
              background: "#fff",
              color: "#334155",
              padding: "11px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          <StatCard
            icon="📚"
            title="Currently Borrowed"
            value={borrowings.length}
            subtitle="Active books"
          />

          <StatCard
            icon="⚠️"
            title="Overdue"
            value={
              borrowings.filter(
                (item) =>
                  item.status?.toLowerCase() === "overdue"
              ).length
            }
            subtitle="Need attention"
          />

          <StatCard
            icon="💰"
            title="Total Fine"
            value={`₹${borrowings.reduce(
              (total, item) =>
                total + Number(item.fineAmount || 0),
              0
            )}`}
            subtitle="Current fine"
          />
        </div>

        {/* Borrowed Books */}
        <section
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0 5px 20px rgba(15,23,42,0.06)",
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
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                }}
              >
                Currently Borrowed Books
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                {borrowings.length} active transaction
                {borrowings.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Link
              to="/borrowings/history"
              style={{
                textDecoration: "none",
                color: "#174ea6",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              📜 View History
            </Link>
          </div>

          {borrowings.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "55px 20px",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  fontSize: "50px",
                  marginBottom: "15px",
                }}
              >
                📚
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#334155",
                }}
              >
                No Currently Borrowed Books
              </h3>

              <p style={{ margin: 0 }}>
                You don't have any active borrowed books.
              </p>

              <Link
                to="/books"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  padding: "11px 20px",
                  borderRadius: "10px",
                  background: "#174ea6",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                📚 Browse Books
              </Link>
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "850px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                    }}
                  >
                    <th style={thStyle}>Book</th>
                    <th style={thStyle}>Transaction ID</th>
                    <th style={thStyle}>Issue Date</th>
                    <th style={thStyle}>Due Date</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Fine</th>
                  </tr>
                </thead>

                <tbody>
                  {borrowings.map((item) => (
                    <tr key={item._id}>
                      <td style={tdStyle}>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#1e293b",
                          }}
                        >
                          {item.bookId?.title || "Unknown Book"}
                        </div>

                        <div
                          style={{
                            marginTop: "4px",
                            color: "#64748b",
                            fontSize: "13px",
                          }}
                        >
                          {item.bookId?.author || "Unknown Author"}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {item.transactionId || item.issueId || "-"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {formatDate(item.issueDate)}
                      </td>

                      <td style={tdStyle}>
                        {formatDate(item.dueDate)}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            ...getStatusStyle(item.status),
                            padding: "7px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            display: "inline-block",
                          }}
                        >
                          {item.status || "Borrowed"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        ₹{Number(item.fineAmount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 5px 20px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          fontSize: "30px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#64748b",
          fontWeight: "700",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "800",
          margin: "8px 0",
          color: "#0f172a",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "15px 12px",
  color: "#475569",
  fontSize: "13px",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "17px 12px",
  borderBottom: "1px solid #eef2f7",
  fontSize: "14px",
  color: "#475569",
};

export default MyBorrowed;