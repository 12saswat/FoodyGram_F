import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Sparkles,
  Award,
  Users,
} from "lucide-react";
import axiosInstance from "../config/axios";

const RestaurantProfile = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantData();
    }
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    try {
      const restaurantRes = await axiosInstance.get(
        `/resturants/${restaurantId}`
      );
      setRestaurant(restaurantRes.data.data);
      setItems(restaurantRes.data.data.items || []);
    } catch (err) {
      setError("Failed to load restaurant data");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (itemId) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem._id === item._id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-orange-200 border-b-orange-500 rounded-full animate-spin"
              style={{ animationDirection: "reverse" }}
            ></div>
          </div>
          <div className="text-center">
            <div className="text-gray-700 text-lg font-semibold mb-1">
              Loading deliciousness...
            </div>
            <div className="text-gray-500 text-sm">
              ✨ Preparing your culinary journey
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-orange-50">
      {/* Cute Header */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="h-48 bg-gradient-to-br from-orange-400 via-orange-400 to-orange-400 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>

          {/* Floating Elements */}
          <div className="absolute top-8 right-8 animate-bounce">
            <Sparkles className="w-6 h-6 text-white/70" />
          </div>
          <div className="absolute top-16 left-1/4 animate-pulse">
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
          <div className="absolute top-12 right-1/3 animate-ping">
            <div className="w-3 h-3 bg-yellow-300/60 rounded-full"></div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-10 left-4 z-10 w-10 h-10 bg-white/25 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-xl hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="absolute -bottom-12 left-4 right-4">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-purple-100 relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-100 to-pink-100 rounded-bl-3xl opacity-50"></div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">
                    {restaurant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                  <span>{restaurant.name}</span>
                  <span className="text-lg">✨</span>
                </h1>

                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-gray-700 font-medium text-sm">
                      {restaurant.rating}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="text-gray-600 text-xs">30-45 min</span>
                  </div>
                </div>

                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-orange-700 rounded-full text-xs font-medium">
                  🍽️ {restaurant.type}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-6">
        {/* Cute Search */}
        <div className="px-4 mb-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="What's making you hungry? 🤤"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-3xl border-2 border-purple-100 focus:ring-4 focus:ring-purple-200 focus:border-purple-300 transition-all shadow-lg text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Cute Categories */}
        <div className="px-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 border-2 border-gray-100 hover:border-purple-200 shadow-md"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category === "All"
                  ? "🍽️ All"
                  : `${getCategoryEmoji(category)} ${category}`}
              </button>
            ))}
          </div>
        </div>

        {/* Cute Menu Items */}
        <div className="px-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-gray-500 font-medium">No yummy items found!</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search 🤔
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Cute decorative element */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-50 to-pink-50 rounded-bl-full opacity-70"></div>

                  <div className="flex space-x-4">
                    {/* Cute Item Image */}
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-purple-200 shadow-lg">
                        {item.videoUrl ? (
                          <video
                            src={item.videoUrl}
                            className="w-full h-full object-cover rounded-2xl"
                            muted
                          />
                        ) : (
                          <span className="text-purple-600 text-2xl font-bold">
                            {item.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800 leading-tight flex items-center space-x-1">
                          <span>{item.name}</span>
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </h3>
                        <button
                          onClick={() => toggleLike(item._id)}
                          className="p-2 hover:bg-pink-50 rounded-full transition-all hover:scale-110"
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              likedItems.has(item._id)
                                ? "text-pink-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {item.description.replace(/"/g, "")}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-purple-600 flex items-center">
                            ₹{item.price}
                          </span>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-5 py-2 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-500 transition-all flex items-center space-x-2 shadow-lg hover:scale-105 hover:shadow-xl"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cute Floating Cart */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <button className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-pulse">
              <ShoppingCart className="w-7 h-7 text-white" />
            </button>
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-purple-700 text-sm font-bold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for category emojis
const getCategoryEmoji = (category) => {
  const emojiMap = {
    "Main Course": "🍛",
    Appetizers: "🥗",
    Beverages: "🥤",
    Desserts: "🍰",
    Snacks: "🍿",
    Pizza: "🍕",
    Burgers: "🍔",
    Chinese: "🥢",
    Indian: "🍛",
    Italian: "🍝",
  };
  return emojiMap[category] || "🍽️";
};

export default RestaurantProfile;
