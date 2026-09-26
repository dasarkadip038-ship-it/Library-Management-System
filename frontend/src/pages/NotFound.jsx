import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <Link to="/dashboard">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
