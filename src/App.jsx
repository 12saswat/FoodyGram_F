import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/customer/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotificationPage from "./pages/NotificationPage";
import SavedPage from "./pages/customer/SavedPage";
import CartPage from "./pages/customer/CartPage";
import OrderPage from "./pages/ordersPage/OrderPage";
import OrderList from "./pages/ordersPage/OrderList";
import ProtectedRoute from "./protected/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AddItem from "./pages/restaurant/AddItem";
import EditItem from "./pages/restaurant/EditItem";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import ItemVideoPage from "./pages/restaurant/ItemVideoPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import RestaurantProfile from "./pages/customer/RestaurantProfile";
import ReelPage from "./pages/restaurant/ReelPage";
import OrdersPage from "./pages/restaurant/OrdersPage";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const RoleBasedRedirect = () => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "customer") {
      return <HomePage isAuthenticated={isAuthenticated} />;
    } else {
      return <Navigate to="/restaurant/dashboard" replace />;
    }
  };
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
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/home" element={<HomePage />} />

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

          <Route
            path="/restaurant/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ItemVideoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/items/add"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/items/edit/:itemId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EditItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant/reels"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ReelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="restaurant/orders"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <OrdersPage />
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
