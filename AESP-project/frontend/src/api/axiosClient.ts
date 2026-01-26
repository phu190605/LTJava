import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Backend chạy trên 8080
  // Lưu ý: Không nên để cứng Content-Type ở đây nếu muốn linh hoạt, 
  // hãy để Interceptor bên dưới xử lý tự động.
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // 1. Đính kèm Token
  if (token && token.trim() !== "") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Xử lý Content-Type linh hoạt
  if (config.data instanceof FormData) {
    // Nếu là FormData (như bài test ghi âm), xóa Content-Type để trình duyệt 
    // tự điền multipart/form-data kèm boundary. Đây là chìa khóa sửa lỗi 415.
    delete config.headers['Content-Type'];
  } else {
    // Với các request bình thường (Login, Get data), mặc định là JSON
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor RESPONSE (Bộ lọc kết quả)
axiosClient.interceptors.response.use(
  (response) => {
    // Tự động bóc vỏ 'data' để code ở Frontend ngắn gọn hơn
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Kiểm tra nếu lỗi 415 vẫn xảy ra để log chi tiết
    if (error.response?.status === 415) {
      console.error("Lỗi 415: Backend từ chối định dạng này. Hãy kiểm tra lại @RequestParam bên Java.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;