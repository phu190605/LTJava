import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  // Không set Content-Type mặc định, để axios tự động khi gửi FormData
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

