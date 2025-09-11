import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Star,
  Clock,
  Users,
  ChefHat,
  MapPin,
  Phone,
  LogOut,
  Settings,
  BarChart3,
  Grid3X3,
  Activity,
  Heart,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";
import axiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";

// Animated Background Component
const AnimatedBackground = () => (
  <>
    {/* Floating circles */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            background:
              i % 3 === 0
                ? "linear-gradient(45deg, #8B5CF6, #A855F7)"
                : i % 3 === 1
                ? "linear-gradient(45deg, #06B6D4, #0891B2)"
                : "linear-gradient(45deg, #F59E0B, #D97706)",
          }}
        />
      ))}
    </div>

    {/* Floating shapes */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(4)].map((_, i) => (
        <div
          key={`shape-${i}`}
          className="absolute animate-pulse"
          style={{
            left: `${10 + i * 25}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: "4s",
          }}
        >
          {i % 2 === 0 ? (
            <Star className="w-6 h-6 text-yellow-300 opacity-30" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-300 opacity-30" />
          )}
        </div>
      ))}
    </div>
  </>
);

const RestaurantDashboard = () => {
  // Demo data - replace with actual API calls
  const [profileData, setProfileData] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("items");
  const [stats, setStats] = useState({
    totalItems: 6,
    totalOrders: 142,
    revenue: 15680,
  });
  const navigate = useNavigate();

  // Keep original API structure for easy replacement
  useEffect(() => {
    fetchRestaurantProfile();
    fetchStats();
  }, []);

  const fetchRestaurantProfile = async () => {
    try {
      const response = await axiosInstance.get("/resturants/profile");
      const data = response.data.data;
      setProfileData(data);
      const itemsData = data?.items || [];
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // const response = await axiosInstance.get("/restaurant/stats");
      // setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const deleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/restaurant/items/${itemId}`);
        setItems(items.filter((item) => item._id !== itemId));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
    console.log("Logout clicked");
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color = "blue",
    delay = 0,
  }) => (
    <div
      className={`bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white border-opacity-20 hover:shadow-xl transition-all duration-500 hover:scale-105`}
      style={{
        animationDelay: `${delay}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg animate-pulse ${
            color === "blue"
              ? "bg-gradient-to-br from-blue-400 to-blue-600"
              : color === "green"
              ? "bg-gradient-to-br from-green-400 to-green-600"
              : color === "purple"
              ? "bg-gradient-to-br from-purple-400 to-purple-600"
              : "bg-gradient-to-br from-orange-400 to-orange-600"
          }`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const renderItemsSection = () => (
    <div className="p-4 relative z-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={Package}
          title="Total Items"
          value={items.length}
          color="blue"
          delay={100}
        />
        <StatCard
          icon={TrendingUp}
          title="Total Orders"
          value={stats.totalOrders || 0}
          color="green"
          delay={200}
        />
      </div>

      {/* Items Grid - Instagram Style */}
      <div className="mb-4" style={{ animation: "slideInUp 0.6s ease-out" }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Grid3X3 className="w-5 h-5 mr-2 animate-bounce" />
          Menu Items
      
        </h3>

        {items.length === 0 ? (
          <div
            className="text-center py-12 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg"
            style={{ animation: "fadeIn 0.5s ease-out" }}
          >
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4 animate-bounce" />
            <p className="text-gray-500 mb-4 text-lg">No items yet!</p>
            <button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => navigate("/item/:id")}
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
                style={{
                  animation: "fadeInScale 0.5s ease-out forwards",
                  animationDelay: `${index * 100}ms`,
                }}
                onClick={() => console.log(`Navigate to item ${item._id}`)}
              >
                {item.videoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute top-2 right-2">
                      <Play className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Edit item ${item._id}`);
                      }}
                      className="absolute top-2 left-2 bg-black bg-opacity-50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:bg-opacity-70"
                    >
                      <Edit className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-200 via-blue-200 to-cyan-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 from-opacity-20 to-blue-400 to-opacity-20 animate-pulse"></div>
                    <span className="text-purple-700 text-2xl font-bold z-10 animate-bounce">
                      {item.name?.charAt(0) || "?"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Edit item ${item._id}`);
                      }}
                      className="absolute top-2 left-2 bg-white bg-opacity-20 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:bg-opacity-30"
                    >
                      <Edit className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black from-opacity-70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-2">
                  <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-semibold mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs bg-green-500 px-2 py-1 rounded-full">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                {/* Floating heart animation on hover */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping">
                  <Heart className="w-6 h-6 text-red-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="p-4 relative z-10">
      <div className="grid grid-cols-1 gap-4 mb-6">
        <StatCard
          icon={TrendingUp}
          title="Revenue"
          value={`₹${stats.revenue || 0}`}
          color="green"
          delay={100}
        />
        <StatCard
          icon={Users}
          title="Total Orders"
          value={stats.totalOrders || 0}
          color="blue"
          delay={200}
        />
        <StatCard
          icon={Package}
          title="Menu Items"
          value={items.length}
          color="purple"
          delay={300}
        />
      </div>

      <div
        className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        style={{ animation: "slideInUp 0.6s ease-out" }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 animate-pulse" />
          Performance Overview
          <TrendingUp className="w-4 h-4 ml-2 text-green-500 animate-bounce" />
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">
              This Month
            </span>
            <span className="text-lg font-bold text-green-600">
              ₹{stats.revenue || 0}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full shadow-inner"
              style={{
                width: "75%",
                animation: "expandWidth 1.5s ease-out",
              }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-xs text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">4.8</div>
              <div className="text-xs text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 relative">
      <AnimatedBackground />

      {/* Mobile Header with Profile */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm shadow-xl relative z-10">
        <div
          className="flex items-center justify-between p-4"
          style={{ animation: "slideInDown 0.5s ease-out" }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow-lg animate-pulse">
              {profileData?.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt={profileData.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <ChefHat className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1
                className="text-lg font-bold text-gray-800"
                style={{ animation: "fadeIn 0.5s ease-out" }}
              >
                {profileData?.name || "Restaurant Name"}
              </h1>
              <p
                className="text-xs text-gray-500"
                style={{
                  animation: "fadeIn 0.5s ease-out",
                  animationDelay: "100ms",
                }}
              >
                {profileData?.email || "restaurant@example.com"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              style={{ animation: "bounceIn 0.6s ease-out" }}
              onClick={() => navigate("/restaurant/items/add")}
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-80 backdrop-blur-sm text-gray-600 p-3 rounded-xl hover:bg-white hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
              style={{
                animation: "bounceIn 0.6s ease-out",
                animationDelay: "200ms",
              }}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        {profileData && (
          <div
            className="px-4 pb-4"
            style={{ animation: "slideInUp 0.6s ease-out" }}
          >
            <div className="flex items-center space-x-6 text-xs text-gray-600">
              {profileData.address && (
                <div className="flex items-center space-x-2 bg-white bg-opacity-50 px-3 py-1 rounded-full">
                  <MapPin className="w-3 h-3 animate-pulse" />
                  <span className="font-medium">{profileData.address}</span>
                </div>
              )}
              {profileData.phone && (
                <div className="flex items-center space-x-2 bg-white bg-opacity-50 px-3 py-1 rounded-full">
                  <Phone className="w-3 h-3 animate-pulse" />
                  <span className="font-medium">{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex border-t border-white border-opacity-20">
          <button
            onClick={() => setActiveSection("items")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
              activeSection === "items"
                ? "text-purple-600 border-b-2 border-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 transform scale-105"
                : "text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-30"
            }`}
          >
            <span>Items</span>
            {activeSection === "items"}
          </button>
          <button
            onClick={() => setActiveSection("analytics")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
              activeSection === "analytics"
                ? "text-purple-600 border-b-2 border-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 transform scale-105"
                : "text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-30"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
            {activeSection === "analytics" && (
              <TrendingUp className="w-3 h-3 text-green-500 animate-bounce" />
            )}
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="transition-all duration-500 transform">
        {activeSection === "items" && renderItemsSection()}
        {activeSection === "analytics" && renderAnalyticsSection()}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
