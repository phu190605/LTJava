import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  // KHÔNG set Content-Type ở đây để trình duyệt tự nhận diện FormData
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Chỉ đính kèm nếu token thực sự tồn tại và không rỗng
  if (token && token.trim() !== "") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;