import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, userRole, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
