import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; 
import PeerRoom from './pages/PeerRoom'; 
import WaitingRoom from './components/WaitingRoom'; 
import TopicSuggestion from './components/WaitingRoom';
import ChatBox from './components/ChatBox'; 


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
          <Route path="/peer-room" element={<PeerRoom />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/topic-suggestion" element={<TopicSuggestion />} />
          <Route path="/chat-box" element={<ChatBox />} />
        
        <Route path="/admin" element={<h1>Khu vực Admin</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;