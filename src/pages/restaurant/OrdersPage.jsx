import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  User,
  MapPin,
  DollarSign,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Truck,
  ChefHat,
  Star,
  Gift,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Download,
  Bell,
} from "lucide-react";
import axiosInstance from "../../config/axios";
import FooterResturant from "./FooterResturant";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [floatingElements, setFloatingElements] = useState([]);

  const statusOptions = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
  ];

  const statusConfig = {
    pending: {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      gradient: "from-amber-400 to-yellow-500",
      icon: Clock,
    },
    confirmed: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      gradient: "from-blue-400 to-indigo-500",
      icon: CheckCircle,
    },
    preparing: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      gradient: "from-orange-400 to-red-500",
      icon: ChefHat,
    },
    ready: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      gradient: "from-emerald-400 to-green-500",
      icon: Gift,
    },
    delivered: {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      gradient: "from-gray-400 to-slate-500",
      icon: Truck,
    },
  };

  const paymentStatusColors = {
    pending: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };

  useEffect(() => {
    // Generate floating elements for visual appeal
    const elements = [
      { id: 1, icon: "🍕", x: 10, y: 15, duration: 20 },
      { id: 2, icon: "🍔", x: 85, y: 25, duration: 25 },
      { id: 3, icon: "🥡", x: 70, y: 8, duration: 18 },
      { id: 4, icon: "🍰", x: 90, y: 45, duration: 22 },
      { id: 5, icon: "🌮", x: 20, y: 60, duration: 28 },
      { id: 6, icon: "🍜", x: 60, y: 70, duration: 24 },
    ];
    setFloatingElements(elements);

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/resturants/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await axiosInstance.put(`/orders/status/${orderId}`, {
        status: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    }
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "all" || order.status === activeFilter;
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-purple-600 font-medium mt-4 text-lg">
            Loading orders...
          </p>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Floating Background Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-4xl lg:text-6xl opacity-5 animate-bounce hidden lg:block"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDuration: `${element.duration}s`,
              animationDelay: `${element.id * 2}s`,
            }}
          >
            {element.icon}
          </div>
        ))}
      </div>

      {/* Header Section */}
      <header className="relative z-10 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-purple-100 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Package className="w-6 h-6 lg:w-8 lg:h-8 text-purple-700" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold bg-clip-text bg-gradient-to-r from-white to-purple-200">
                  Restaurant Orders
                </h1>
                <p className="text-purple-200 text-sm lg:text-base">
                  Manage and track all your orders in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
              </div>
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={fetchOrders}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-6">
            {[
              {
                value: orders.length,
                label: "Total Orders",
                icon: Package,
                color: "from-blue-400 to-indigo-500",
              },
              {
                value: getOrdersByStatus("pending"),
                label: "Pending",
                icon: Clock,
                color: "from-amber-400 to-orange-500",
              },
              {
                value: getOrdersByStatus("delivered"),
                label: "Delivered",
                icon: CheckCircle,
                color: "from-green-400 to-emerald-500",
              },
              {
                value: `${getTotalRevenue()}`,
                label: "Revenue",
                icon: TrendingUp,
                color: "from-pink-400 to-rose-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-2 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div
                  className={`w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg lg:rounded-xl flex items-center justify-center mb-2 lg:mb-3 shadow-lg`}
                >
                  <stat.icon className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-base lg:text-2xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-purple-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="relative z-10 px-4 -mt-6">
        <div className="container mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-xl border border-gray-200">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by customer name, order ID, or item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide space-x-2">
              {[
                "all",
                "pending",
                "confirmed",
                "preparing",
                "ready",
                "delivered",
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize border ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border-transparent transform scale-105"
                      : "text-gray-600 hover:text-purple-600 bg-white/70 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {filter === "all" ? "All Orders" : filter}
                  {filter !== "all" && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeFilter === filter ? "bg-white/20" : "bg-gray-200"
                      }`}
                    >
                      {getOrdersByStatus(filter)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm ? "No matching orders found" : "No Orders Found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Orders will appear here once customers place them"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order, index) => {
              const StatusIcon =
                statusConfig[order.status]?.icon || AlertCircle;
              return (
                <div
                  key={order._id}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Order Header */}
                  <div
                    className={`bg-gradient-to-r ${
                      statusConfig[order.status]?.gradient ||
                      "from-gray-400 to-gray-500"
                    } text-white p-4 lg:p-6 relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <StatusIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              Order #{order._id.slice(-6)}
                            </h3>
                            <p className="text-white/80 text-sm flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {getTimeAgo(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl lg:text-3xl font-bold">
                            ${order.totalAmount}
                          </div>
                          <div className="text-white/80 text-sm">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 lg:p-6 space-y-4">
                    {/* Status and Payment Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${
                          statusConfig[order.status]?.color ||
                          "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          paymentStatusColors[order.paymentStatus]
                        }`}
                      >
                        Payment: {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Customer Info */}
                    {order.user && (
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100 group-hover:border-purple-200 transition-colors">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-lg">
                              {order.user.name}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {order.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 font-medium">
                              {order.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center text-lg">
                        <Gift className="w-5 h-5 mr-2 text-purple-500" />
                        Order Items
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {order.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {item.quantity}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-lg truncate">
                                {item.item.name}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">
                                Category: {item.item.category}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-500">
                                  ${item.item.price} × {item.quantity}
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                  ${item.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-600 mb-3">
                        Update Status:
                      </h5>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order._id, status)}
                            disabled={
                              updatingOrder === order._id ||
                              order.status === status
                            }
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                              order.status === status
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg transform hover:scale-105 active:scale-95"
                            } ${
                              updatingOrder === order._id
                                ? "opacity-50 cursor-wait"
                                : ""
                            }`}
                          >
                            {updatingOrder === order._id &&
                              order.status !== status && (
                                <RefreshCw className="inline w-3 h-3 mr-1 animate-spin" />
                              )}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span className="font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span className="font-medium">
                            {formatDate(order.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FooterResturant order={orders.length} />
      {/* Bottom padding for mobile navigation */}
      <div className="h-20 lg:h-8"></div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;
