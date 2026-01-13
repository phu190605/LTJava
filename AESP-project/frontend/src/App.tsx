import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới
import ProfileSetupPage from './pages/ProfileSetupPage'; // trang thiết lập hồ sơ, mục tiu
import SettingsPage from './pages/SettingsPage'; // trang cài đặt tài khoản
import PaymentHistoryPage from './pages/PaymentHistoryPage'; //  trang lịch sử thanh toán
import SubscriptionPage from './pages/SubscriptionPage'; // trang Quản lý gói học
import AIPracticePage from './pages/AIPracticePage'; //  trang Luyện nói AI 1-1
import LearnerLayout from './layouts/LearnerLayout'; // Layout dành cho Learner
import CheckoutPage from './pages/CheckoutPage';// trang Thanh toán
import PaymentSuccessPage from './pages/PaymentSuccessPage';// trang Kết quả thanh toán

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ công khai: Ai cũng vào được */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Trang dành cho Learner: Phải đăng nhập mới vào được */}
        <Route element={<LearnerLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} /> {/* Trang tổng quan */}
          <Route path="/setup" element={<ProfileSetupPage />} /> {/* Trang thiết lập hồ sơ, mục tiêu */}
          <Route path="/settings" element={<SettingsPage />} /> {/* Trang cài đặt tài khoản */}
          <Route path="/payment-history" element={<PaymentHistoryPage />} /> {/* Trang lịch sử thanh toán */}
          <Route path="/subscription" element={<SubscriptionPage />} /> {/* Trang Quản lý gói học */}
          <Route path="/ai-practice" element={<AIPracticePage />} /> {/* Trang Luyện nói AI 1-1 */}
          <Route path="/checkout/:packageId" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* Các route giữ chỗ (Placeholder) cho Menu đỡ lỗi */}
          <Route path="/my-courses" element={<div>Trang Khóa học (Đang phát triển)</div>} />
          <Route path="/schedule" element={<div>Trang Lịch học (Đang phát triển)</div>} />
        </Route>

        {/* Trang nội bộ: Phải đăng nhập mới vào được (Đã xử lý trong MainLayout) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/admin" element={<h1>Khu vực Admin</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;