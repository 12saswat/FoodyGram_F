import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, userRole, children }) => {
  if (!isAuthenticated) {
    if (userRole === "restaurant") {
      return <Navigate to="/restaurant/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
