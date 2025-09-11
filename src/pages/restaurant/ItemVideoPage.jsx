import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  BookmarkPlus,
  Play,
  Pause,
} from "lucide-react";
import axiosInstance from "../../config/axios";

const ItemVideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, [item]);

  useEffect(() => {
    return () => {
      // Cleanup video when component unmounts
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  const fetchItem = async () => {
    try {
      const response = await axiosInstance.get(`/items/item/${id}`);
      setItem(response.data.data);
    } catch (error) {
      console.error("Failed to fetch item:", error);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleSave = async () => {
    try {
      await axiosInstance.post(`/user/save/${id}`);
      setSaved(!saved);
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const addToCart = async () => {
    try {
      await axiosInstance.post(`/user/cart/${id}`);
      // Show success feedback
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={item?.videoUrl}
        loop
        muted
        playsInline
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-4 z-50 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}

      {/* Item Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-4">
            <h1 className="text-white text-2xl font-bold mb-2">{item?.name}</h1>
            <p className="text-white/80 text-sm mb-3 line-clamp-3">
              {item?.description}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-white text-xl font-bold">
                ₹{item?.price}
              </span>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                {item?.category}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={toggleLike}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                liked ? "bg-red-500" : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "text-white fill-current" : "text-white"
                }`}
              />
            </button>

            <button
              onClick={toggleSave}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                saved ? "bg-yellow-500" : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <BookmarkPlus
                className={`w-5 h-5 ${
                  saved ? "text-white fill-current" : "text-white"
                }`}
              />
            </button>

            <button
              onClick={addToCart}
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemVideoPage;
