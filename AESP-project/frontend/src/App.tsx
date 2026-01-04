import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới
import PolicyManager from './pages/admin/PolicyManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ công khai: Ai cũng vào được */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Trang nội bộ: Phải đăng nhập mới vào được (Đã xử lý trong MainLayout) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/admin" element={<h1>Khu vực Admin</h1>} />
        <Route path="p" element={<PolicyManager />} />
        <Route path="/admin/policy" element={<PolicyManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;