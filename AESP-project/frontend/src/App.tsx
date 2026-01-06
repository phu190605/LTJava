import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới
import UserManagement from './pages/UserManagement';
import MentorManager from './pages/MentorManager';

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
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin */}
        <Route path="/admin" element={<h1>Khu vực Admin</h1>} />
        <Route path="/admin/users" element={<UserManagement/>}/>
        <Route path="/admin/mentors" element={<MentorManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
