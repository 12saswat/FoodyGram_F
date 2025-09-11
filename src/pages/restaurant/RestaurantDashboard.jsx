import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";

const RestaurantDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantItems();
    fetchStats();
    console.log("token for dashboard", localStorage.getItem("authToken"));
  }, []);

  const fetchRestaurantItems = async () => {
    try {
      const response = await axiosInstance.get("/resturants/profile");
      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/restaurant/stats");

      setStats(response.data.data);
      console.log("Stats:", response.data.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Restaurant Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your menu items and track performance
              </p>
            </div>
            <button
              onClick={() => navigate("/restaurant/items/add")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all flex items-center space-x-2 shadow-lg hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Item</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalItems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-purple-600 font-bold">₹</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{stats.revenue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Menu Items
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-gray-500 font-medium mb-2">No items yet!</p>
              <p className="text-gray-400 text-sm mb-4">
                Start by adding your first menu item
              </p>
              <button
                onClick={() => navigate("/restaurant/items/add")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="relative mb-4">
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        className="w-full h-40 object-cover rounded-xl"
                        muted
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                        <span className="text-orange-600 text-4xl font-bold">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-orange-600">
                      ₹{item.price}
                    </span>
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/restaurant/items/edit/${item._id}`)
                      }
                      className="flex-1 bg-blue-500 text-white py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
