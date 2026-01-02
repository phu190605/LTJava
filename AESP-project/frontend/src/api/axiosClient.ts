import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Chú ý: Cổng 8080 hoặc 3307 tùy server bạn chạy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mọi request nếu có (để sau này gọi API bảo mật)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;