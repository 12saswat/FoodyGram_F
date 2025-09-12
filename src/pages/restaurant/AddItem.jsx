import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Video,
  Image as ImageIcon,
  Camera,
  X,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "../../config/axios";

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    resturantId: "", // Added resturantId field
    quantity: 1,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get restaurant ID from localStorage or context
    const restaurantId = localStorage.getItem("user");

    if (restaurantId) {
      setFormData((prev) => ({
        ...prev,
        resturantId: restaurantId,
      }));
    }
  }, []);

  const categories = [
    "Main Course",
    "Appetizers",
    "Beverages",
    "Desserts",
    "Snacks",
    "Pizza",
    "Burgers",
    "Chinese",
    "Indian",
    "Italian",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      if (errors.video) {
        setErrors((prev) => ({ ...prev, video: "" }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!videoFile) {
      newErrors.video = "Video is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("resturantId", formData.resturantId); // Updated field name
      formDataToSend.append("videoUrl", videoFile);
      if (imageFile) {
        formDataToSend.append("imageUrl", imageFile);
      }
      console.log("form data for add", formDataToSend);
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await axiosInstance.post("/items/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/restaurant/dashboard");
    } catch (error) {
      console.error("Failed to add item:", error);
      setErrors({ submit: "Failed to add item. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/restaurant/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800">Add New Item</h1>
            <p className="text-xs text-gray-500">Create delicious content</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2 text-purple-600" />
              Video Content *
            </h3>

            {!videoPreview ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-purple-50 to-pink-50">
                  <Camera className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-purple-600 font-medium mb-1">
                    Tap to upload video
                  </p>
                  <p className="text-xs text-gray-500">MP4, MOV up to 50MB</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Video ready
                </div>
              </div>
            )}
            {errors.video && (
              <p className="text-red-500 text-sm mt-2">{errors.video}</p>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-orange-600" />
              Cover Image (Optional)
            </h3>

            {!imagePreview ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center hover:border-orange-400 transition-colors bg-gradient-to-br from-orange-50 to-yellow-50">
                  <ImageIcon className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                  <p className="text-orange-600 font-medium mb-1">
                    Add cover image
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Item Details
            </h3>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Spicy Chicken Burger"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe what makes this item special..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mx-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-white/20">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Item...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Add to Menu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddItem;
