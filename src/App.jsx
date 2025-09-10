import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import RestaurantProfile from "./pages/RestaurantProfile";
import NotificationPage from "./pages/NotificationPage";
import SavedPage from "./pages/SavedPage";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/ordersPage/OrderPage";
import OrderList from "./pages/ordersPage/OrderList";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./protected/ProtectedRoute";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // null = loading

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");

      // Check if both token and user exist
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<HomePage isAuthenticated={isAuthenticated} />}
          />

          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/restaurants/profile/:restaurantId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RestaurantProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <NotificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SavedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <OrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/list"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
