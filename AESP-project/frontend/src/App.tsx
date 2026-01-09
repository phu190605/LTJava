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
import MentorLayout from "./layouts/MentorLayout";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import FeedbackEditor from "./pages/mentor/FeedbackEditor";
import Materials from "./pages/mentor/Materials";
import FeedbackList from "./pages/mentor/FeedbackList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang công khai */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* User dashboard */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Trang nội bộ: Phải đăng nhập mới vào được (Đã xử lý trong MainLayout) */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/*mentor*/}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          <Route path="feedback/:sessionId" element={<FeedbackEditor />} />
          <Route path="feedback" element={<FeedbackList />} />
          <Route path="materials" element={<Materials />} />
        </Route>
        {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="mentors" element={<MentorManager />} />
        <Route path="policies" element={<PolicyManager />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
