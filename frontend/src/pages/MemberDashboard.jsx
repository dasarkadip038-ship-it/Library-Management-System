import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navigation from "../components/Navigation";

function MemberDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [member, setMember] = useState(null);
  const [borrowings, setBorrowings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMemberDashboard();
  }, []);

  const loadMemberDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!savedUser) {
        navigate("/login");
        return;
      }

      setUser(savedUser);

      let memberData = null;

      // 1. First try memberId from logged-in user
      const memberId =
        savedUser.memberId ||
        savedUser.memberID ||
        savedUser.member_id;

      if (memberId) {
        try {
          const response = await API.get(`/members/${memberId}`);
          memberData = response.data.member || response.data;
        } catch (err) {
          console.log("Member ID search failed");
        }
      }

      // 2. If memberId is not available, find member using email
      if (!memberData && savedUser.email) {
        const response = await API.get("/members");

        const members = response.data.members || [];

        memberData = members.find(
          (m) =>
            m.email &&
            m.email.toLowerCase() === savedUser.email.toLowerCase()
        );
      }

      if (!memberData) {
        setError(
          "No member profile found for this account. Please make sure this login is linked with a library member."
        );
        setLoading(false);
        return;
      }

      setMember(memberData);

      // 3. Get this member's borrowing history
      const borrowingResponse = await API.get(
        `/borrowings/member/${memberData.memberId}`
      );

      const borrowingList =
        borrowingResponse.data.borrowings || [];

      setBorrowings(borrowingList);

      setLoading(false);
    } catch (err) {
      console.error("Member Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load Member Dashboard"
      );

      setLoading(false);
    }
  };

  const activeBorrowings = borrowings.filter(
    (item) =>
      item.status?.toLowerCase() === "borrowed" ||
      item.status?.toLowerCase() === "overdue"
  );

  const overdueBorrowings = borrowings.filter(
    (item) => item.status?.toLowerCase() === "overdue"
  );

  const totalFine = borrowings.reduce(
    (total, item) => total + Number(item.fineAmount || 0),
    0
  );

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "borrowed") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "returned") {
      return {
        background: "#e0f2fe",
        color: "#075985",
      };
    }

    if (value === "overdue") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#f3f4f6",
      color: "#374151",
    };
  };

  if (loading) {
    return (
      <>
        <Navigation />

        <div
          style={{
            minHeight: "calc(100vh - 70px)",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "15px" }}>
              📚
            </div>

            <h2 style={{ margin: 0, color: "#111827" }}>
              Loading Member Dashboard...
            </h2>

            <p style={{ color: "#6b7280" }}>
              Please wait
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />

      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          background: "#f8fafc",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Member Portal
              </p>

              <h1
                style={{
                  margin: "5px 0 0",
                  color: "#111827",
                  fontSize: "32px",
                }}
              >
                Welcome, {member?.name || user?.name || "Member"} 👋
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#64748b",
                }}
              >
                Manage your library activities from one place.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={loadMemberDashboard}
                style={{
                  border: "1px solid #d1d5db",
                  background: "white",
                  color: "#374151",
                  padding: "11px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                🔄 Refresh
              </button>

              <button
                onClick={() => navigate("/books")}
                style={{
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  padding: "11px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                📚 Browse Books
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "18px",
                borderRadius: "14px",
                marginBottom: "25px",
              }}
            >
              <strong>⚠️ {error}</strong>

              <div style={{ marginTop: "12px" }}>
                <button
                  onClick={() => navigate("/profile")}
                  style={{
                    border: "none",
                    background: "#991b1b",
                    color: "white",
                    padding: "9px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Go to Profile
                </button>
              </div>
            </div>
          )}

          {/* Member Information */}
          {member && (
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "25px",
                marginBottom: "25px",
                boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                  }}
                >
                  <div
                    style={{
                      width: "65px",
                      height: "65px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#2563eb,#7c3aed)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  >
                    {(member.name || "M")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2
                      style={{
                        margin: 0,
                        color: "#111827",
                      }}
                    >
                      {member.name}
                    </h2>

                    <p
                      style={{
                        margin: "5px 0",
                        color: "#64748b",
                      }}
                    >
                      Member ID:{" "}
                      <strong>{member.memberId}</strong>
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color: "#64748b",
                      }}
                    >
                      {member.email}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background:
                        member.status === "active"
                          ? "#dcfce7"
                          : "#fee2e2",
                      color:
                        member.status === "active"
                          ? "#166534"
                          : "#991b1b",
                      fontWeight: "700",
                      fontSize: "13px",
                    }}
                  >
                    {member.status === "active"
                      ? "● Active Member"
                      : "● Inactive Member"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(210px,1fr))",
              gap: "18px",
              marginBottom: "28px",
            }}
          >
            <StatCard
              icon="📚"
              title="Total Transactions"
              value={borrowings.length}
              description="All borrowing records"
            />

            <StatCard
              icon="📖"
              title="Active Borrowings"
              value={activeBorrowings.length}
              description="Currently borrowed"
            />

            <StatCard
              icon="⚠️"
              title="Overdue Books"
              value={overdueBorrowings.length}
              description="Need attention"
            />

            <StatCard
              icon="💰"
              title="Total Fine"
              value={`₹${totalFine}`}
              description="Total accumulated fine"
            />
          </div>

          {/* Current Borrowings */}
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "25px",
              marginBottom: "25px",
              boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
              border: "1px solid #e5e7eb",
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
                    color: "#111827",
                  }}
                >
                  📖 Current Borrowings
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Books currently issued to you
                </p>
              </div>

              <button
                onClick={() => navigate("/borrowings/my")}
                style={{
                  border: "none",
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "9px 14px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                View All
              </button>
            </div>

            {activeBorrowings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "45px 20px",
                  color: "#64748b",
                  background: "#f8fafc",
                  borderRadius: "14px",
                }}
              >
                <div style={{ fontSize: "40px" }}>📚</div>

                <h3
                  style={{
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  No Active Borrowings
                </h3>

                <p>
                  You currently don't have any borrowed books.
                </p>

                <button
                  onClick={() => navigate("/books")}
                  style={{
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    padding: "10px 18px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Browse Books
                </button>
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
                    minWidth: "750px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8fafc",
                        textAlign: "left",
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
                    {activeBorrowings.map((item) => (
                      <tr key={item._id}>
                        <td style={tdStyle}>
                          <strong>
                            {item.bookId?.title ||
                              item.book?.title ||
                              "Book"}
                          </strong>

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginTop: "4px",
                            }}
                          >
                            {item.bookId?.author ||
                              item.book?.author ||
                              ""}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          {item.transactionId ||
                            item.issueId ||
                            "-"}
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
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: "700",
                              display: "inline-block",
                            }}
                          >
                            {item.status}
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
          </div>

          {/* Recent History */}
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "25px",
              boxShadow: "0 8px 25px rgba(15,23,42,0.06)",
              border: "1px solid #e5e7eb",
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
                    color: "#111827",
                  }}
                >
                  📜 Borrowing History
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Your recent library transactions
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/borrowings/history")
                }
                style={{
                  border: "none",
                  background: "#f3f4f6",
                  color: "#374151",
                  padding: "9px 14px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Full History
              </button>
            </div>

            {borrowings.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "35px",
                  color: "#64748b",
                }}
              >
                No borrowing history found.
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
                    minWidth: "700px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8fafc",
                        textAlign: "left",
                      }}
                    >
                      <th style={thStyle}>Book</th>
                      <th style={thStyle}>Transaction</th>
                      <th style={thStyle}>Issue Date</th>
                      <th style={thStyle}>Return Date</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Fine</th>
                    </tr>
                  </thead>

                  <tbody>
                    {borrowings.slice(0, 5).map((item) => (
                      <tr key={item._id}>
                        <td style={tdStyle}>
                          <strong>
                            {item.bookId?.title ||
                              item.book?.title ||
                              "Book"}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {item.transactionId ||
                            item.issueId ||
                            "-"}
                        </td>

                        <td style={tdStyle}>
                          {formatDate(item.issueDate)}
                        </td>

                        <td style={tdStyle}>
                          {item.returnDate
                            ? formatDate(item.returnDate)
                            : "-"}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              ...getStatusStyle(item.status),
                              padding: "6px 10px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: "700",
                              display: "inline-block",
                            }}
                          >
                            {item.status}
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
          </div>

          {/* Quick Actions */}
          <div
            style={{
              marginTop: "25px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(200px,1fr))",
              gap: "15px",
            }}
          >
            <QuickAction
              icon="📚"
              title="Browse Books"
              description="Find available books"
              onClick={() => navigate("/books")}
            />

            <QuickAction
              icon="📖"
              title="My Borrowed Books"
              description="View active borrowings"
              onClick={() => navigate("/borrowings/my")}
            />

            <QuickAction
              icon="📜"
              title="History"
              description="View borrowing history"
              onClick={() =>
                navigate("/borrowings/history")
              }
            />

            <QuickAction
              icon="👤"
              title="My Profile"
              description="View your profile"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Components ---------- */

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "22px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 25px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "30px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: "5px 0",
          color: "#111827",
          fontSize: "28px",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid #e5e7eb",
        background: "white",
        borderRadius: "15px",
        padding: "20px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0 5px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          color: "#111827",
          fontSize: "16px",
        }}
      >
        {title}
      </strong>

      <p
        style={{
          margin: "5px 0 0",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        {description}
      </p>
    </button>
  );
}

const thStyle = {
  padding: "14px 12px",
  fontSize: "13px",
  color: "#475569",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "15px 12px",
  fontSize: "13px",
  color: "#374151",
  borderBottom: "1px solid #f1f5f9",
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default MemberDashboard;