import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Search,
} from "lucide-react";
import axiosInstance from "../../config/axios";

const SavedPage = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      const response = await axiosInstance.get("/user/savedItems");

      setSavedItems(response.data.response || []);
    } catch (err) {
      console.error("Failed to fetch saved items:", err);
      setError("Failed to load saved items");
    } finally {
      setLoading(false);
    }
  };

  const removeSavedItem = async (itemId) => {
    try {
      await axiosInstance.post(`/user/saved/delete/${itemId}`);
      setSavedItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Failed to remove saved item:", err);
    }
  };

  const addToCart = async (item) => {
    try {
      await axiosInstance.post(`/user/checkout/saved/${item._id}`, {
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1, // default to 1, or use item.quantity if available
        category: item.category,
        // add other fields as needed
      });
      navigate("/orders/list");
      // Show success feedback
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-700 text-lg font-medium">
            Loading saved items...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-yellow-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center hover:bg-yellow-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-yellow-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Saved Items</h1>
                <p className="text-sm text-yellow-600">
                  {savedItems.length} items saved
                </p>
              </div>
            </div>
            <Bookmark className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {savedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No saved items yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start saving your favorite dishes!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all"
            >
              Explore Food
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-yellow-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4">
                  {/* Item Image/Video */}
                  {item.imageUrl || item.videoUrl ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl">🍽️</span>
                    </div>
                  )}

                  {/* Item Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.description?.replace(/"/g, "")}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">
                        ₹{item.price}
                      </span>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeSavedItem(item._id)}
                      className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
