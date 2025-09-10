import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Trash2,
  X,
  Clock,
  CheckCircle,
  Truck,
  Star,
  MapPin,
  Phone,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // Set viewport height for mobile
    const setVH = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  // After fetchOrders, update selectedOrder if open
  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = orders.find((o) => o._id === selectedOrder._id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
    console.log("Updated selectedOrder:", orders);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");

      console.log("Orders:", response.data.orders);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axiosInstance.post("/orders/place", {
        items,
      });
      if (response.data.success) {
        fetchOrders();
        setShowPlaceOrder(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axiosInstance.delete(`orders/delete/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId));
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const removeOrderItem = async (orderId, itemId) => {
    try {
      await axiosInstance.post(`/orders/remove/${orderId}/${itemId}`);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.filter((item) => item._id !== itemId),
              }
            : order
        )
      );
      await fetchOrders();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-pulse-glow bg-white rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="text-center mt-4 text-gray-600 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 safe-top safe-bottom">
      {/* Header */}
      <div className="sticky top-0 z-50 glass backdrop-blur-md border-b border-white/20 px-4 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center lg:gap-3 gap-1">
            <ShoppingBag className="lg:w-8 lg:h-8 w-6 h-6 text-orange-500" />
            <h1 className="lg:text-2xl lg:font-bold font-semibold tracking-normal gradient-text">
              FoodyGram Orders
            </h1>
          </div>
          <button
            onClick={() => setShowPlaceOrder(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white lg:px-6 px-4 py-2 rounded-full font-semibold btn-glow transition-all duration-300 hover:scale-105 mobile-touch-target"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            New Order
          </button>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 py-3 leading-0 rounded-full bg-yellow-100 flex items-center justify-center hover:bg-yellow-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-yellow-600" />
        </button>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by placing your first order!
            </p>
            <button
              onClick={() => setShowPlaceOrder(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold btn-glow transition-all duration-300 hover:scale-105"
            >
              Place Your First Order
            </button>
          </div>
        ) : (
          // Order cards
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn border border-white/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {order.items[0]?.resturantId?.name ||
                          order.items[0]?.resturant?.name ||
                          "Unknown Restaurant"}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ml-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Order Items Preview - Mobile Optimized */}
                  <div className="space-y-2 mb-3">
                    {order.items.slice(0, 1).map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-2 relative"
                      >
                        {/* Item Image - Smaller */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                        />

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>

                        {/* Cross Button - Smaller */}
                        <button
                          onClick={() => removeOrderItem(order._id, item._id)}
                          className="absolute -top-1 -right-1 w-4 h-4 text-gray-400 hover:text-red-500 transition-colors text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {order.items.length > 1 && (
                      <p className="text-xs text-gray-500 ml-10">
                        +{order.items.length - 1} more items
                      </p>
                    )}
                  </div>

                  {/* Order Footer - Mobile Stacked Layout */}
                  <div className="border-t pt-3">
                    {/* Price and Date */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-base text-gray-800">
                          ₹{order.totalAmount}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile Optimized */}
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-orange-100 text-orange-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-orange-200 transition-colors flex-1 min-h-[36px]"
                      >
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors flex-1 min-h-[36px] flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePay(order)}
                          className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors flex-1 min-h-[36px]"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Order #{selectedOrder._id}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 mobile-touch-target"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Restaurant Info */}
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-800">
                    {selectedOrder.items[0]?.resturant?.name ||
                      "Unknown Restaurant"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedOrder.items[0]?.resturant?.address ||
                      "Unknown Address"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() =>
                            removeOrderItem(selectedOrder._id, item._id)
                          }
                          className="text-red-500 hover:text-red-700 text-sm mt-1 mobile-touch-target"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="gradient-text">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Place Order Modal */}
      {showPlaceOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Place New Order
              </h2>
              <p className="text-gray-600 mb-6">
                This will place a sample order. In a real app, you'd have a cart
                selection here.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={placeOrder}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold btn-glow transition-all duration-300 hover:scale-105"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => setShowPlaceOrder(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
