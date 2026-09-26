import { Link, useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toLowerCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isMember = role === "member";

  return (
    <nav
      style={{
        background: "#071a3d",
        color: "#fff",
        padding: "18px 22px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Link
          to={isMember ? "/member-dashboard" : "/dashboard"}
          style={{
            textDecoration: "none",
            color: "#fff",
            fontSize: "22px",
            fontWeight: "800",
          }}
        >
          📚 Library
        </Link>

        <div
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
          }}
        >
          {isMember ? "Member Portal" : "Admin Portal"}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {isMember ? (
          <>
            {/* MEMBER MENU */}
            <NavButton
              to="/member-dashboard"
              text="🏠 Dashboard"
            />

            <NavButton
              to="/books"
              text="📚 Browse Books"
            />

            <NavButton
              to="/borrowings/my"
              text="📖 My Borrowed"
            />

            <NavButton
              to="/borrowings/history"
              text="📜 History"
            />

            <NavButton
              to="/profile"
              text="👤 Profile"
            />
          </>
        ) : (
          <>
            {/* ADMIN MENU */}
            <NavButton
              to="/dashboard"
              text="🏠 Dashboard"
            />

            <NavButton
              to="/books"
              text="📚 Books"
            />

            <NavButton
              to="/books/add"
              text="➕ Add Book"
            />

            <NavButton
              to="/members"
              text="👥 Members"
            />

            <NavButton
              to="/members/add"
              text="➕ Add Member"
            />

            <NavButton
              to="/borrowings"
              text="🔄 Borrowings"
            />

            <NavButton
              to="/borrowings/issue"
              text="📤 Issue"
            />

            <NavButton
              to="/borrowings/return"
              text="📥 Return"
            />

            <NavButton
              to="/overdue"
              text="⚠️ Overdue"
            />

            <NavButton
              to="/borrowings/history"
              text="📜 History"
            />

            <NavButton
              to="/categories"
              text="🗂️ Categories"
            />

            <NavButton
              to="/profile"
              text="👤 Profile"
            />
          </>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            border: "none",
            background: "#ef4444",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "9px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

function NavButton({ to, text }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "#fff",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "10px 14px",
        borderRadius: "9px",
        fontWeight: "600",
        fontSize: "13px",
        transition: "0.2s",
      }}
    >
      {text}
    </Link>
  );
}

export default Navigation;