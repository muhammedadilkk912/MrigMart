import axios from "axios";
 import store from "../Redux/store"; // adjust path to your actual store
import { setLogout } from "../Redux/AuthSlic";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4500/api",
  withCredentials: true,
});

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
