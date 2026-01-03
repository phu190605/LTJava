import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ công khai: Ai cũng vào được */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Trang nội bộ: Phải đăng nhập mới vào được (Đã xử lý trong MainLayout) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/admin" element={<h1>Khu vực Admin</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;