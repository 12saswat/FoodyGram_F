import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
} from "lucide-react";
import axiosInstance from "../../config/axios";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("user/cartItems");
      setCartData(
        response.data.response || { items: [], totalItems: 0, totalAmount: 0 }
      );
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckout = async () => {
    try {
      const response = await axiosInstance.post("/user/checkout", {
        items: cartData.items,
        totalAmount: cartData.totalAmount,
        totalItems: cartData.totalItems,
      });

      const orderId = response?.data.orderId || response.data._id;

      if (orderId) {
        navigate(`/orders/list`);
      } else {
        alert("Order placement failed.");
      }
      fetchCartItems(); // Refresh cart data
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      await axiosInstance.post(`user/updateCart/${itemId}`, {
        quantity: newQuantity,
      });
      fetchCartItems(); // Refresh cart data
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Call remove API endpoint
      await axiosInstance.post(`user/cart/delete/${itemId}`);
      fetchCartItems(); // Refresh cart data
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-700 text-lg font-medium">
            Loading cart...
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
                <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
                <p className="text-sm text-orange-600">
                  {cartData.totalItems} items
                </p>
              </div>
            </div>
            <ShoppingCart className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {cartData.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cartData.items.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="bg-white rounded-xl p-3 shadow-sm border border-orange-100"
              >
                <div className="flex items-start space-x-3">
                  {/* Item Image - Smaller size */}

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

                  {/* Item Info - Takes most space */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                      {item.description?.replace(/"/g, "")}
                    </p>

                    {/* Price and Category - Stacked on mobile */}
                    <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <span className="text-base font-bold text-orange-600">
                        ₹{item.price}
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium self-start">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls - Compact for mobile */}
                  <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-600 transition-colors active:scale-95"
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

      {/* Checkout Footer */}
      {cartData.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">
                Total ({cartData.totalItems} items)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{cartData.totalAmount}
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all flex items-center space-x-2 shadow-lg"
              onClick={handleCheckout} // <-- Navigate to order page with cart ID
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-semibold">Checkout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
