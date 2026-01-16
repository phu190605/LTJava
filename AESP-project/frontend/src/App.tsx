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
import CheckoutPage from './pages/CheckoutPage';// trang Thanh toán
import PaymentSuccessPage from './pages/PaymentSuccessPage';// trang Kết quả thanh toán
import AdminReportPage from './pages/admin/AdminReport';

function App() {
  return (
<BrowserRouter>
  <Routes>

    {/* PUBLIC */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/admin-login" element={<AdminLoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* LEARNER */}
    <Route element={<LearnerLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/setup" element={<ProfileSetupPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/payment-history" element={<PaymentHistoryPage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/ai-practice" element={<AIPracticePage />} />
      <Route path="/checkout/:packageId" element={<CheckoutPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
    </Route>

    {/* ADMIN */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="mentors" element={<MentorManager />} />
      <Route path="packages" element={<PackageManager />} />
      <Route path="purchases" element={<PurchaseManager />} />
      <Route path="policies" element={<PolicyManager />} />
      <Route path="/admin/reports" element={<AdminReportPage />} />
    </Route>

  </Routes>
</BrowserRouter>

  );
}

export default App;
