import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../config/axios";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Star,
  CreditCard,
  Wallet,
  Smartphone,
  Plus,
  Minus,
  ShoppingBag,
  Calendar,
  User,
  Receipt,
  AlertCircle,
  Loader,
} from "lucide-react";

const OrderPage = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/orders`);
      setOrder(response.data.order || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load order details"
      );
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    try {
      setProcessing(true);

      const paymentData = {
        orderId: order._id || order.id,
        amount: order.total || order.totalAmount,
        paymentMethod,
        currency: "INR",
      };

      const response = await axiosInstance.post("payment/process", paymentData);

      if (response.data.success) {
        setPaymentSuccess(true);
        setOrder((prev) => ({
          ...prev,
          status: "confirmed",
          paymentStatus: "paid",
        }));
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "delivered":
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
        <div className="animate-pulse-glow bg-white rounded-2xl p-8 shadow-2xl text-center">
          <Loader className="animate-spin w-12 h-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
          <p className="text-sm text-gray-400 mt-2">Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrderDetails}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-semibold btn-glow transition-all duration-300 hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No order data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 safe-top safe-bottom">
      {/* Header */}
      <div className="sticky top-0 z-50 glass backdrop-blur-md border-b border-white/20 px-4 py-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="mobile-touch-target p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold gradient-text">Order Details</h1>
            <p className="text-sm text-gray-600">
              #{order.orderId || order._id}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusIcon(order.status)}
            {(order.status || "pending").toUpperCase()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Restaurant Info */}
        {order.restaurant && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fadeIn">
            <div className="flex items-center gap-4">
              {order.restaurant.image && (
                <img
                  src={order.restaurant.image}
                  alt={order.restaurant.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {order.restaurant.name || "Restaurant"}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{order.restaurant.rating || "N/A"}</span>
                  <span>•</span>
                  <Clock className="w-4 h-4" />
                  <span>{order.restaurant.deliveryTime || "N/A"}</span>
                </div>
              </div>
            </div>

            {order.restaurant.address && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{order.restaurant.address}</p>
                    {order.restaurant.phone && (
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {order.restaurant.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            Order Items
          </h3>

          <div className="space-y-4">
            {(order.items || []).map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      ₹{item.price}
                    </span>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-500">
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Order Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{(order.subtotal || order.total || 0).toFixed(2)}</span>
            </div>

            {order.deliveryFee && (
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}

            {order.gst && (
              <div className="flex justify-between text-gray-600">
                <span>GST & Taxes</span>
                <span>₹{order.gst.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="gradient-text">
                ₹{(order.total || order.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {!paymentSuccess &&
          (order.status === "pending" || order.paymentStatus !== "paid") && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Payment Method
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {[
                  { id: "card", icon: CreditCard, label: "Credit/Debit Card" },
                  { id: "upi", icon: Smartphone, label: "UPI" },
                  { id: "wallet", icon: Wallet, label: "Wallet" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 mobile-touch-target ${
                      paymentMethod === method.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="font-medium">{method.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold btn-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin w-5 h-5" />
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${(order.total || order.totalAmount || 0).toFixed(2)}`
                )}
              </button>
            </div>
          )}

        {/* Payment Success */}
        {paymentSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-fadeIn">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-green-600">
              Your order has been confirmed and will be prepared shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
