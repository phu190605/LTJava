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

//  Interceptor RESPONSE (Bộ lọc kết quả)
// Tác dụng: Tự động bóc vỏ 'data' ra trước khi trả về cho LoginPage
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu có data thì trả về data, giúp LoginPage gọi res.token là thấy ngay
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
// SỬA: Dùng Promise.reject thay vì throw error để đúng chuẩn Axios
    return Promise.reject(error);
  }
);
export default axiosClient;