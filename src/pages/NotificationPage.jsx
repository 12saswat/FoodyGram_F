import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Heart,
  ShoppingCart,
  Star,
  Clock,
  Check,
  X,
  Gift,
  Utensils,
  MapPin,
} from "lucide-react";

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock notifications data - replace with API call
    const mockNotifications = [
      {
        id: 1,
        type: "order",
        title: "Order Delivered! 🎉",
        message:
          "Your Chicken Biryani from Ocean Breeze Diner has been delivered",
        time: "2 min ago",
        read: false,
        icon: "🍽️",
        color: "from-green-500 to-emerald-500",
      },
      {
        id: 2,
        type: "like",
        title: "Someone liked your review ❤️",
        message: "Your review for Margherita Pizza got 5 likes",
        time: "15 min ago",
        read: false,
        icon: "❤️",
        color: "from-red-500 to-pink-500",
      },
      {
        id: 3,
        type: "offer",
        title: "Special Offer! 🎁",
        message: "Get 30% off on your next order from Pizza Palace",
        time: "1 hour ago",
        read: true,
        icon: "🎁",
        color: "from-orange-500 to-yellow-500",
      },
      {
        id: 4,
        type: "restaurant",
        title: "New Restaurant Added! 🆕",
        message: "Spice Garden just joined FoodReels near your location",
        time: "3 hours ago",
        read: true,
        icon: "🏪",
        color: "from-purple-500 to-indigo-500",
      },
      {
        id: 5,
        type: "order",
        title: "Order Confirmed ✅",
        message: "Your order from Burger King is being prepared",
        time: "1 day ago",
        read: true,
        icon: "✅",
        color: "from-blue-500 to-cyan-500",
      },
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-700 text-lg font-medium">
            Loading notifications...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-orange-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-orange-600">
                    {unreadCount} unread notification
                    {unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500">
              We'll notify you when something interesting happens!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                  notification.read
                    ? "border-gray-100"
                    : "border-orange-200 bg-orange-50/30"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${notification.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                  >
                    <span className="text-white text-lg">
                      {notification.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {notification.time}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
