import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới
import UserManagement from './pages/admin/UserManagement';
import MentorManager from './pages/admin/MentorManager';
import PolicyManager from './pages/admin/PolicyManager';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './layouts/AdminLayout';
import RegisterPage from './pages/Register';
import LoginPage from './pages/LoginPage';
import PackageManager from "./pages/admin/PackageManager";
import PurchaseManager from "./pages/admin/PurchaseManager";
import AdminProfile from "./pages/admin/AdminProfile";
import ProfileSetupPage from './pages/ProfileSetupPage'; // trang thiết lập hồ sơ, mục tiu
import SettingsPage from './pages/SettingsPage'; // trang cài đặt tài khoản
import PaymentHistoryPage from './pages/PaymentHistoryPage'; //  trang lịch sử thanh toán
import SubscriptionPage from './pages/SubscriptionPage'; // trang Quản lý gói học
import AIPracticePage from './pages/AIPracticePage'; //  trang Luyện nói AI 1-1
import LearnerLayout from './layouts/LearnerLayout'; // Layout dành cho Learner

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang công khai */}
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

          {/* Các route giữ chỗ (Placeholder) cho Menu đỡ lỗi */}
          <Route path="/my-courses" element={<div>Trang Khóa học (Đang phát triển)</div>} />
          <Route path="/schedule" element={<div>Trang Lịch học (Đang phát triển)</div>} />
        </Route>
        {/* User dashboard */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Trang nội bộ: Phải đăng nhập mới vào được (Đã xử lý trong MainLayout) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="mentors" element={<MentorManager />} />
        <Route path="packages" element={<PackageManager />} />
        <Route path="purchases" element={<PurchaseManager />} />
        <Route path="policies" element={<PolicyManager />} />
      </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
