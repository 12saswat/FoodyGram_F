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
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/restaurants/profile/:restaurantId"
            element={<RestaurantProfile />}
          />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders/:orderId" element={<OrderPage />} />
          <Route path="/orders/list" element={<OrderList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
