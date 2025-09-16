import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Bookmark,
  ShoppingCart,
  Star,
  MapPin,
  Play,
  Menu,
  Home,
  Bell,
  BookmarkPlus,
  BaggageClaim,
  ClipboardList,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../../config/axios";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedItems, setLikedItems] = useState(new Set());
  const [savedItems, setSavedItems] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchItems();
    fetchSavedItems();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const videoHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / videoHeight);

        if (newIndex !== currentVideoIndex && newIndex < items.length) {
          setCurrentVideoIndex(newIndex);
          handleVideoPlay(newIndex);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentVideoIndex, items.length]);

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get("/items");
      const shuffled = response.data.data
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      setItems(shuffled);
    } catch (err) {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedItems = async () => {
    try {
      const response = await axiosInstance.get("user/savedItems");
      const savedItemIds = response.data.data?.map((item) => item._id) || [];
      setSavedItems(new Set(savedItemIds));
    } catch (err) {
      console.error("Failed to fetch saved items:", err);
    }
  };

  const handleVideoPlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === index) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  };

  const toggleVideoPlay = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
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

  const toggleSave = async (itemId) => {
    try {
      await axiosInstance.post(`user/save/${itemId}`);
      setSavedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  const addToCart = async (item) => {
    try {
      await axiosInstance.post(`/user/cart/${item._id}`);
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
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const getSavedItemsData = () => {
    return items.filter((item) => savedItems.has(item._id));
  };

  useEffect(() => {
    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = "none";

    // Handle mobile viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      document.body.style.overscrollBehavior = "auto";
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // Add touch handling for better mobile experience
  const handleTouchStart = useRef(null);
  const handleTouchEnd = (e, index) => {
    if (!handleTouchStart.current) {
      return;
    }

    const touchEnd = e.changedTouches[0].clientY;
    const touchStart = handleTouchStart.current;
    const diff = touchStart - touchEnd;

    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe up - next video
        const nextIndex = Math.min(index + 1, items.length - 1);
        if (nextIndex !== index) {
          containerRef.current?.scrollTo({
            top: nextIndex * window.innerHeight,
            behavior: "smooth",
          });
        }
      } else {
        // Swipe down - previous video
        const prevIndex = Math.max(index - 1, 0);
        if (prevIndex !== index) {
          containerRef.current?.scrollTo({
            top: prevIndex * window.innerHeight,
            behavior: "smooth",
          });
        }
      }
    }

    handleTouchStart.current = null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">
            Loading delicious reels...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">{error}</div>
          <button
            onClick={fetchItems}
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Video Feed */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((item, index) => (
          <div key={item._id} className="relative h-screen w-full snap-start">
            {/* Video */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover"
              src={item.videoUrl}
              loop
              muted
              playsInline
              onClick={() => toggleVideoPlay(index)}
              onLoadedData={() => {
                if (index === 0) {
                  handleVideoPlay(0);
                }
              }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 " />

            {/* Restaurant Info - Top with Gradient Blur */}
            <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b pt-3 pb-6">
              <div className="px-4">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        navigate(
                          `/restaurants/profile/${item.resturantId?._id}`
                        )
                      }
                      className="flex-1"
                      disabled={!item.resturantId}
                    >
                      <div className="flex items-center space-x-3 rounded-2xl p-3 shadow-lg hover:bg-white/20 transition-all">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
                          <span className="text-white text-sm font-bold">
                            {item.resturantId?.name?.charAt(0).toUpperCase() ||
                              "R"}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-bold text-base drop-shadow-lg">
                            {item.resturantId?.name || "Restaurant"}
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                              <span className="text-white text-sm font-medium drop-shadow-sm">
                                {item.resturantId?.rating || "N/A"}
                              </span>
                            </div>
                            <span className="text-gray-200 text-sm">•</span>
                            <div className="flex items-center space-x-1 max-w-[120px] sm:max-w-[200px]">
                              <MapPin className="w-4 h-4 text-gray-300 drop-shadow-sm" />
                              <span
                                className="text-gray-200 text-sm truncate drop-shadow-sm block"
                                title={
                                  item.resturantId?.address ||
                                  "Address not available"
                                }
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  display: "block",
                                  maxWidth: "100%",
                                }}
                              >
                                {item.resturantId?.address ||
                                  "Address not available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Notification Button */}
                    <button
                      onClick={() => navigate("/notifications")}
                      className="ml-3 w-10 h-10 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white/30 transition-all relative"
                    >
                      <Bell className="w-5 h-5 text-white" />
                      {/* Notification Badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  // show login/register buttons
                  <div className="flex justify-end space-x-3 p-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 bg-orange-500 text-white rounded-full"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-4 py-2 bg-gray-200 text-black rounded-full"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Overlay - Bottom */}
            <div className="absolute bottom-12 left-0 right-0 p-6">
              <div className="flex justify-between items-end">
                {/* Left Side - Food Info */}
                <div className="flex-1 pr-4 max-w-[70%]">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-1 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">
                        {item.description.replace(/"/g, "")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-orange-400 text-xl font-bold">
                        ₹{item.price}
                      </span>
                      <span className="bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm text-orange-200 px-2 py-1 rounded-full text-xs font-medium border border-orange-400/30">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex flex-col items-center space-y-4">
                  {/* Order Button */}
                  <button
                    onClick={() => navigate("/orders/list")}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/30 group-hover:scale-110">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">
                      Orders
                    </span>
                  </button>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(item._id)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        likedItems.has(item._id)
                          ? "bg-red-500 shadow-lg shadow-red-500/30"
                          : "bg-white/20 backdrop-blur-sm group-hover:bg-red-500/30"
                      }`}
                    >
                      <Heart
                        className={`w-6 h-6 transition-all duration-300 ${
                          likedItems.has(item._id)
                            ? "text-white fill-current scale-110"
                            : "text-white group-hover:text-red-400 group-hover:scale-110"
                        }`}
                      />
                    </div>
                    <span className="text-white text-xs font-medium">Like</span>
                  </button>

                  {/* Save Button */}
                  <button
                    onClick={() => toggleSave(item._id)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        savedItems.has(item._id)
                          ? "bg-yellow-500 shadow-lg shadow-yellow-500/30"
                          : "bg-white/20 backdrop-blur-sm group-hover:bg-yellow-500/30"
                      }`}
                    >
                      <BookmarkPlus
                        className={`w-5 h-5 transition-all duration-300 ${
                          savedItems.has(item._id)
                            ? "text-white fill-current scale-110"
                            : "text-white group-hover:text-yellow-400 group-hover:scale-110"
                        }`}
                      />
                    </div>
                    <span className="text-white text-xs font-medium">Save</span>
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(item)}
                    className="flex flex-col items-center space-y-1 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300 shadow-lg shadow-orange-500/30 group-hover:scale-110">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Play/Pause Indicator */}
            {currentVideoIndex === index &&
              videoRefs.current[index]?.paused && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-around py-3 px-4">
          <button className="flex flex-col items-center space-y-1 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-500/20 group-hover:bg-orange-500/30 transition-all">
              <Home className="w-5 h-5 text-orange-400" />
            </div>
          </button>

          <button
            onClick={() => navigate("/saved")}
            className="flex flex-col items-center space-y-1 group relative"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            {savedItems.size > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {savedItems.size}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => navigate("/customer/dashboard")}
            className="flex flex-col items-center space-y-1 group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <Menu className="w-5 h-5 text-white" />
            </div>
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center space-y-1 group relative"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all">
              <BaggageClaim className="w-5 h-5 text-white" />
            </div>
            {cartItems.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
