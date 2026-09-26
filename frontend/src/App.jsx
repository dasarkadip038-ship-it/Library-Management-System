import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// ===============================
// AUTH PAGES
// ===============================
import Login from "./pages/Login";
import Register from "./pages/Register";

// ===============================
// DASHBOARD
// ===============================
import Dashboard from "./pages/Dashboard";
import MemberDashboard from "./pages/MemberDashboard";

// ===============================
// BOOK PAGES
// ===============================
import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import BookDetails from "./pages/BookDetails";

// ===============================
// MEMBER PAGES
// ===============================
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import EditMember from "./pages/EditMember";
import MemberDetails from "./pages/MemberDetails";

// ===============================
// BORROWING / ISSUE / RETURN
// ===============================
import Borrowings from "./pages/Borrowings";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import OverdueBooks from "./pages/OverdueBooks";
import BorrowingHistory from "./pages/BorrowingHistory";
import MyBorrowed from "./pages/MyBorrowed";

// ===============================
// CATEGORY
// ===============================
import Categories from "./pages/Categories";

// ===============================
// PROFILE
// ===============================
import Profile from "./pages/Profile";

// ===============================
// NOT FOUND
// ===============================
import NotFound from "./pages/NotFound";


function App() {

  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            HOME
        ===================================== */}

        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            AUTHENTICATION
        ===================================== */}

        <Route
          path="/login"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Register />
            )
          }
        />


        {/* =====================================
            ADMIN / MAIN DASHBOARD
        ===================================== */}

        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            MEMBER DASHBOARD
        ===================================== */}

        <Route
          path="/member-dashboard"
          element={
            token ? (
              <MemberDashboard />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            BOOK MANAGEMENT
        ===================================== */}

        <Route
          path="/books"
          element={
            token ? (
              <Books />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/books/add"
          element={
            token ? (
              <AddBook />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/books/edit/:id"
          element={
            token ? (
              <EditBook />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/books/:id"
          element={
            token ? (
              <BookDetails />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            MEMBER MANAGEMENT
        ===================================== */}

        <Route
          path="/members"
          element={
            token ? (
              <Members />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/members/add"
          element={
            token ? (
              <AddMember />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/members/edit/:id"
          element={
            token ? (
              <EditMember />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/members/:id"
          element={
            token ? (
              <MemberDetails />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            BORROWINGS
        ===================================== */}

        <Route
          path="/borrowings"
          element={
            token ? (
              <Borrowings />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/borrowings/issue"
          element={
            token ? (
              <IssueBook />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/borrowings/return"
          element={
            token ? (
              <ReturnBook />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/borrowings/history"
          element={
            token ? (
              <BorrowingHistory />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/borrowings/my"
          element={
            token ? (
              <MyBorrowed />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            OVERDUE BOOKS
        ===================================== */}

        <Route
          path="/overdue"
          element={
            token ? (
              <OverdueBooks />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            CATEGORIES
        ===================================== */}

        <Route
          path="/categories"
          element={
            token ? (
              <Categories />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            PROFILE
        ===================================== */}

        <Route
          path="/profile"
          element={
            token ? (
              <Profile />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =====================================
            404
        ===================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;