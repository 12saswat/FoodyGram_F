import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth easily
export const useAuth = () => useContext(AuthContext);
