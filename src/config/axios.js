import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 👇 Debug log: full URL + method
    console.log(
      `🚀 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`,
      config
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error responses
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;

        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;

        case 404:
          // Not found
          console.error("Resource not found");
          break;

        case 422:
          // Validation error
          console.error("Validation error:", response.data.errors);
          break;

        case 500:
          // Server error
          console.error("Internal server error");
          break;

        default:
          console.error(
            "An error occurred:",
            response.data.message || "Unknown error"
          );
      }
    } else if (error.request) {
      // Network error
      console.error("❌ Network Error:", error.message);
    } else {
      // Other error
      console.error("❌ Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
