import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChefHat, Play, Package } from "lucide-react";

const FooterResturant = ({ order }) => {
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active section based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/restaurant/dashboard") {
      setActiveSection("dashboard");
    } else if (currentPath === "/restaurant/reels") {
      setActiveSection("reels");
    } else if (currentPath === "/restaurant/orders") {
      setActiveSection("orders");
    } else {
      setActiveSection("");
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Bottom Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/1 backdrop-blur-sm border-t border-white/20 shadow-xl safe-bottom">
        <div className="flex items-center justify-around px-2">
          {/* Home - Dashboard */}
          <button
            onClick={() => navigate("/restaurant/dashboard")}
            className="flex flex-col items-center space-y-1 group mobile-touch-target rounded-xl transition-all"
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                activeSection === "dashboard"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30 scale-110"
                  : "bg-gray-100 group-hover:bg-purple-100 group-active:scale-95"
              }`}
            >
              <ChefHat
                className={`w-5 h-5 ${
                  activeSection === "dashboard"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-purple-600"
                }`}
              />
            </div>
            <span
              className={`text-xs font-semibold ${
                activeSection === "dashboard"
                  ? "text-purple-600"
                  : "text-gray-500"
              }`}
            >
              Home
            </span>
          </button>

          {/* Reels - Customer View */}
          <button
            onClick={() => navigate("/restaurant/reels")}
            className="flex flex-col items-center space-y-1 group mobile-touch-target p-2 rounded-xl transition-all group-active:scale-95"
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                activeSection === "reels"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 scale-110"
                  : "bg-gray-100 group-hover:bg-orange-100"
              }`}
            >
              <Play
                className={`w-5 h-5 ${
                  activeSection === "reels"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-orange-600"
                }`}
              />
            </div>
            <span
              className={`text-xs font-semibold ${
                activeSection === "reels" ? "text-orange-600" : "text-gray-500"
              }`}
            >
              Reels
            </span>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate("/restaurant/orders")}
            className="flex flex-col items-center space-y-1 group mobile-touch-target p-2 rounded-xl transition-all relative group-active:scale-95"
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                activeSection === "orders"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 scale-110"
                  : "bg-gray-100 group-hover:bg-blue-100"
              }`}
            >
              <Package
                className={`w-5 h-5 ${
                  activeSection === "orders"
                    ? "text-white"
                    : "text-gray-600 group-hover:text-blue-600"
                }`}
              />
              {/* Order notification badge */}
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white text-xs font-bold">{order}</span>
              </div>
            </div>
            <span
              className={`text-xs font-semibold ${
                activeSection === "orders" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Orders
            </span>
          </button>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-24 md:h-20"></div>
    </>
  );
};

export default FooterResturant;
