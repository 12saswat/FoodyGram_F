import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging (remove in production)
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    // Handle common error responses
    const { response } = error;

    if (response) {
      console.error(`❌ ${response.status} Error:`, response.data);

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
