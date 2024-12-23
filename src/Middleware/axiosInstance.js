import axios from "axios";
// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your backend's base URL
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log(config)
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach the token
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // Forward the response if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized cases (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

// Standardized method for GET requests with params
axiosInstance.getWithParams = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params }); // Attach params
    // console.log(response)
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("GET Request failed:", error);
    throw error; // Re-throw error for the calling function to handle
  }
};

axiosInstance.postWithBody = async (url, body = {}) => {
  try {
    // console.log("Post is called")
    const response = await axiosInstance.post(url, body); // Attach body to POST request

    return response.data; // Return the response data directly
  } catch (error) {
    console.error("POST Request failed:", error);
    throw error; // Re-throw error for the calling function to handle
  }
};

// Export the Axios instance
export default axiosInstance;
