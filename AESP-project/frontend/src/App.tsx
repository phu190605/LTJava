import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới
import TestSpeechPage from './pages/TestSpeechPage';
import PeerFindPage from './pages/PeerFindPage';
import PeerRoomPage from './pages/PeerRoomPage';
import CreateRoomPage from './pages/CreateRoomPage';
import PracticeRoomPage from './pages/PracticeRoomPage';

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
        <Route path="/test-speech" element={<TestSpeechPage />} />
        <Route path="/peer/find" element={<PeerFindPage />} />
        <Route path="/peer/create" element={<CreateRoomPage />} />
        <Route path="/peer/room/:roomId" element={<PeerRoomPage />} />
        <Route path="/practice" element={<PracticeRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;