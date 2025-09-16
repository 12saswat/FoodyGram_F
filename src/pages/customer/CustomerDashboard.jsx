import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  ShoppingBag,
  Heart,
  ChevronRight,
  Award,
  Zap,
  Flame,
  Trophy,
  Target,
  Sparkles,
  Bell,
  Gift,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [statsAnimated, setStatsAnimated] = useState(false);

  const navigate = useNavigate();

  // Placeholder states - connect these to your APIs
  const [userProfile, setUserProfile] = useState({
    name: "",
    avatar: "",
    address: "",
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [popularHotels, setPopularHotels] = useState([]);
  const [foodAnalytics, setFoodAnalytics] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    favoriteFood: "",
    savedAmount: 0,
  });

  // Elegant floating elements and animations
  useEffect(() => {
    // Sophisticated floating elements
    const generateFloatingElements = () => {
      const elements = [
        { id: 1, icon: "✨", x: 20, y: 15, duration: 20 },
        { id: 2, icon: "🌟", x: 80, y: 25, duration: 25 },
        { id: 3, icon: "💫", x: 60, y: 5, duration: 30 },
        { id: 4, icon: "⭐", x: 90, y: 45, duration: 22 },
        { id: 5, icon: "✦", x: 10, y: 35, duration: 28 },
      ];
      setFloatingElements(elements);
    };

    generateFloatingElements();

    setTimeout(() => setStatsAnimated(true), 800);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    setTimeout(() => {
      setShowNotification(true);
    }, 3000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // API calls - replace with your actual endpoints
  useEffect(() => {
    fetchdahboardData();
  }, []);

  const fetchdahboardData = async () => {
    try {
      const response = await axiosInstance("/user/dashboard");
      const data = response.data;
      console.log("Dashboard Data:", data);
      setUserProfile(data.data.user);
      setRecentOrders(data.data.recentOrders);
      setPopularHotels(data.data.popularHotels);
      setFoodAnalytics(data.data.foodAnalytics);
      setStats(data.data.stats);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return "Good Morning";
    }
    if (hour < 17) {
      return "Good Afternoon";
    }
    return "Good Evening";
  };
  const handelLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Elegant Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-lg opacity-20 animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDuration: `${element.duration}s`,
              animationDelay: `${element.id * 0.5}s`,
            }}
          >
            {element.icon}
          </div>
        ))}
      </div>

      {/* Animated Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse-soft"></div>
            </div>
            <div className="animate-fade-in-up">
              <p className="text-gray-300 text-sm">{getGreeting()}</p>
              <h1 className="text-xl font-bold">
                {userProfile.name || "Welcome Back"}
              </h1>
              <div className="flex items-center space-x-2 mt-1 text-gray-300">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">
                  {userProfile.address || "Set delivery address"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="text-right animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
            onClick={() => handelLogout()}
          >
            Logout
          </div>
        </div>

        {/* Stats Cards with staggered animation */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: stats.totalOrders || 0, label: "Orders" },
            { value: "🏆", label: "Premium" },
            { value: "4.8", label: "Rating", hasRating: true },
          ].map((stat, index) => (
            <div
              key={stat.id}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 ${
                statsAnimated ? "animate-fade-in-up" : "opacity-0 translate-y-4"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-2xl font-bold mb-1">
                {stat.hasRating ? (
                  <div className="flex justify-center items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm">{stat.value}</span>
                  </div>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-xs text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Button with ripple effect */}
      <div className="px-6 -mt-4 relative z-10">
        <button
          onClick={() => navigate("/orders/list")}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-orange-500/30 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3 group relative overflow-hidden animate-slide-up"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Start Ordering</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6 relative z-10">
        {/* Tab Navigation with smooth indicator */}
        <div
          className="bg-white/80 backdrop-blur-md rounded-xl p-1 shadow-lg border border-gray-200 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex relative">
            <div
              className={`absolute top-1 bottom-1 bg-gray-900 rounded-lg transition-all duration-300 ${
                activeTab === "recent"
                  ? "left-1 right-1/2 mr-0.5"
                  : "left-1/2 right-1 ml-0.5"
              }`}
            ></div>
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 relative z-10 ${
                activeTab === "recent"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recent Orders
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 relative z-10 ${
                activeTab === "analytics"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Your Insights
            </button>
          </div>
        </div>

        {/* Recent Orders Tab */}
        {activeTab === "recent" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>Recent Orders</span>
              </h2>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>

            {recentOrders.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 animate-scale-in mx-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center animate-float">
                  <ShoppingBag className="w-7 h-7 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                  No orders yet
                </h3>
                <p className="text-sm text-gray-500 mb-6 px-2">
                  Discover amazing restaurants and place your first order
                </p>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm font-medium">
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4 pb-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Header with Order ID and Status - Mobile Stacked */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <ShoppingBag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-gray-900 font-bold text-base truncate">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right flex justify-between sm:flex-col sm:items-end">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                            order.status === "pending"
                              ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                              : order.status === "delivered"
                              ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                              : order.status === "cancelled"
                              ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                              : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <div
                          className={`text-xs mt-1 font-medium ${
                            order.paymentStatus === "paid"
                              ? "text-green-600"
                              : order.paymentStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          Payment: {order.paymentStatus}
                        </div>
                      </div>
                    </div>

                    {/* Items List - Mobile Optimized */}
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 mb-4 border border-gray-100">
                      <h4 className="text-gray-700 font-medium mb-3 flex items-center text-sm">
                        <Gift className="w-4 h-4 mr-2 text-orange-500" />
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-center py-2 px-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-orange-200 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {item.quantity}
                              </div>
                              <span className="text-gray-800 font-medium text-sm truncate">
                                {item.item.name}
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <div className="text-gray-900 font-semibold text-sm">
                                ₹{item.price}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs text-gray-500">
                                  ₹{item.item.price} each
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total and Actions Footer - Mobile Stacked */}
                    <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                        <div className="text-xs text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        <div className="text-right sm:hidden">
                          <div className="text-xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                            ₹
                            {order.totalAmount ||
                              order.items.reduce(
                                (sum, i) => sum + i.price * i.quantity,
                                0
                              )}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:space-x-4">
                        {/* Total - Hidden on mobile, shown on larger screens */}
                        <div className="text-right hidden sm:block">
                          <div className="text-xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text ">
                            ₹
                            {order.totalAmount ||
                              order.items.reduce(
                                (sum, i) => sum + i.price * i.quantity,
                                0
                              )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total Amount
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {order.status === "pending" && (
                            <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 font-medium">
                              Track
                            </button>
                          )}
                          <button className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 font-medium">
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator Bar */}
                    <div className="mt-4 relative">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            order.status === "pending"
                              ? "w-1/3 bg-gradient-to-r from-yellow-400 to-yellow-500"
                              : order.status === "delivered"
                              ? "w-full bg-gradient-to-r from-green-400 to-green-500"
                              : order.status === "cancelled"
                              ? "w-1/4 bg-gradient-to-r from-red-400 to-red-500"
                              : "w-2/3 bg-gradient-to-r from-blue-400 to-blue-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Ordered</span>
                        <span className="hidden sm:inline">Preparing</span>
                        <span className="sm:hidden">Prep.</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Your Food Insights</span>
              </h2>
              <span className="text-sm text-gray-500">This month</span>
            </div>

            {foodAnalytics.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 animate-scale-in mx-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-float">
                  <TrendingUp className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                  Insights Coming Soon
                </h3>
                <p className="text-sm text-gray-500 mb-6 px-2">
                  Place a few more orders to see personalized food analytics
                </p>
                <div className="grid grid-cols-3 gap-2 max-w-40 mx-auto">
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div
                    className="h-6 bg-gray-200 rounded animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-3 bg-gray-100 rounded animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 px-4 pb-4">
                {/* Analytics Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white mb-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        Your Food Analytics
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Discover your taste preferences
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cards */}
                {foodAnalytics.map((category, index) => (
                  <div
                    key={category._id}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center shadow-sm">
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {category._id.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-gray-900 font-bold text-base">
                            {category._id}
                          </h4>
                          <p className="text-gray-500 text-xs">
                            {category.totalItems} item
                            {category.totalItems !== 1 ? "s" : ""} ordered
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                          ₹{Math.round(category.avgPrice)}
                        </div>
                        <div className="text-xs text-gray-500">Avg Price</div>
                      </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 font-medium">
                          Order Frequency
                        </span>
                        <span className="text-xs text-gray-500">
                          {category.totalItems} orders
                        </span>
                      </div>

                      {/* Visual representation bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              (category.totalItems /
                                Math.max(
                                  ...foodAnalytics.map((f) => f.totalItems)
                                )) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      {/* Price Range Indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              category.avgPrice < 200
                                ? "bg-green-400"
                                : category.avgPrice < 300
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-600">
                            {category.avgPrice < 200
                              ? "Budget Friendly"
                              : category.avgPrice < 300
                              ? "Moderate"
                              : "Premium"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Total: ₹
                          {Math.round(category.avgPrice * category.totalItems)}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                        <div className="text-blue-600 font-bold text-sm">
                          {(
                            (category.totalItems /
                              foodAnalytics.reduce(
                                (sum, f) => sum + f.totalItems,
                                0
                              )) *
                            100
                          ).toFixed(0)}
                          %
                        </div>
                        <div className="text-blue-500 text-xs">Of Orders</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center border border-green-100">
                        <div className="text-green-600 font-bold text-sm">
                          {category.avgPrice > 250
                            ? "High"
                            : category.avgPrice > 180
                            ? "Med"
                            : "Low"}
                        </div>
                        <div className="text-green-500 text-xs">Price Tier</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-200 mt-4">
                  <h4 className="text-gray-800 font-semibold text-sm mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                    Your Taste Profile
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {foodAnalytics.length}
                      </div>
                      <div className="text-xs text-gray-500">Cuisine Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        ₹
                        {Math.round(
                          foodAnalytics.reduce(
                            (sum, f) => sum + f.avgPrice,
                            0
                          ) / foodAnalytics.length
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Avg Spend</div>
                    </div>
                  </div>

                  {/* Most Popular Category */}
                  {(() => {
                    const mostOrdered = foodAnalytics.reduce((prev, current) =>
                      prev.totalItems > current.totalItems ? prev : current
                    );
                    return (
                      <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="text-center">
                          <div className="text-orange-600 font-semibold text-sm">
                            Favorite: {mostOrdered._id}
                          </div>
                          <div className="text-orange-500 text-xs">
                            {mostOrdered.totalItems} orders • ₹
                            {Math.round(mostOrdered.avgPrice)} avg
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Popular Hotels Near You */}
        <div
          className="space-y-4 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500 animate-flicker" />
              <span>Trending Near You</span>
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-500 font-medium">LIVE</span>
            </div>
          </div>

          {popularHotels.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 mx-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center animate-float">
                  <Award className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Discovering Popular Spots
                  </h3>
                  <p className="text-xs text-gray-500">
                    Finding trending restaurants
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { item: "Pizza", emoji: "🍕" },
                  { item: "Burgers", emoji: "🍔" },
                  { item: "Chinese", emoji: "🥡" },
                  { item: "Desserts", emoji: "🍰" },
                ].map((food, index) => (
                  <div
                    key={index}
                    className="text-center p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="text-sm mb-1">{food.emoji}</div>
                    <div className="text-xs text-gray-600">{food.item}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 pb-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Popular Restaurants
                </h3>
                <button className="text-orange-500 text-sm font-medium">
                  View All
                </button>
              </div>

              {/* Compact Restaurant Cards */}
              <div className="space-y-2">
                {popularHotels.slice(0, 4).map((hotel, index) => (
                  <div
                    key={hotel._id}
                    onClick={() =>
                      navigate(`/restaurants/profile/${hotel._id}`)
                    }
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-white text-lg font-bold">
                          {hotel.name.charAt(0)}
                        </span>
                      </div>

                      {/* Restaurant Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate pr-2">
                            {hotel.name}
                          </h4>

                          {/* Rating */}
                          <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full flex-shrink-0">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-green-700 text-xs font-semibold">
                              {hotel.rating}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-3 h-3 text-gray-400 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs text-gray-500 truncate">
                            {hotel.address
                              .split(",")
                              .slice(-2)
                              .join(",")
                              .trim()}
                          </span>

                          {/* Food Type Dot */}
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              hotel.type === "veg"
                                ? "bg-green-500"
                                : hotel.type === "non-veg"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <svg
                        className="w-4 h-4 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {popularHotels.length > 4 && (
                <div className="mt-3 text-center">
                  <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
                    +{popularHotels.length - 4} more restaurants
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Smart Recommendations with animated gradient */}
        <div
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-xl relative overflow-hidden animate-fade-in-up"
          style={{ animationDelay: "1s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 animate-sparkle" />
              </div>
              <div>
                <h3 className="font-bold">Smart Recommendations</h3>
                <p className="text-xs text-purple-200">Powered by AI</p>
              </div>
            </div>
            <Gift className="w-5 h-5 text-purple-200 animate-bounce-soft" />
          </div>

          <p className="text-purple-100 mb-4 text-sm relative z-10">
            Based on your preferences and popular trends in your area
          </p>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {[
              { emoji: "🍝", name: "Italian Cuisine", match: "92%" },
              { emoji: "🍛", name: "Indian Spices", match: "88%" },
            ].map((item, index) => (
              <div
                key={item.name}
                className="bg-white/15 backdrop-blur-sm rounded-lg p-3 hover:bg-white/25 transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${1.2 + index * 0.2}s` }}
              >
                <div
                  className="text-2xl mb-2 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {item.emoji}
                </div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-purple-200 mt-1">
                  {item.match} match
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced sections continue with similar animation patterns... */}
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(2deg);
          }
          50% {
            transform: translateY(0px) rotate(0deg);
          }
          75% {
            transform: translateY(10px) rotate(-2deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: rotate(0deg);
          }
          50% {
            opacity: 0.7;
            transform: rotate(180deg);
          }
        }

        @keyframes flicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .animate-flicker {
          animation: flicker 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
