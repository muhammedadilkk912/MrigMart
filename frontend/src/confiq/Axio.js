import axios from "axios";
 import store from "../Redux/store.js"; // adjust path to your actual store
import { setLogout } from "../Redux/AuthSlic.js";

// This reads the base URL from your .env file
const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("base url",baseURL)

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
 // : "http://localhost:4500/api",
  // baseURL:"https://mrigmart-backend.onrender.com/api",

// Response Interceptor for catching 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => { 
    if (error.response?.status === 401) {
      console.log("axiosinterceptor=",error)
      store.dispatch(setLogout());
      window.location.href = "/token-expired"; // Works outside React
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
