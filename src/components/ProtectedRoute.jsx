import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("AuthToken");

  if (!token) {
    // user not logged in — redirect to login
    return <Navigate to="/" replace />;
  }

  // user is logged in — allow access
  return children;
};

export default ProtectedRoute;
