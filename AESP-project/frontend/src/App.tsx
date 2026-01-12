
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SpeakingTest from './pages/SpeakingTest';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; 
import ProfileSetupPage from './pages/ProfileSetupPage'; 
import SettingsPage from './pages/SettingsPage'; 
import PaymentHistoryPage from './pages/PaymentHistoryPage'; 
import SubscriptionPage from './pages/SubscriptionPage'; 
import AIPracticePage from './pages/AIPracticePage'; 
import LearnerLayout from './layouts/LearnerLayout'; 
import TestSpeechPage from './pages/TestSpeechPage';
import PeerFindPage from './pages/PeerFindPage';
import PeerRoomPage from './pages/PeerRoomPage';
import CreateRoomPage from './pages/CreateRoomPage';
import PracticeRoomPage from './pages/PracticeRoomPage';
import GamificationDashboard from './pages/GamificationDashboard';
import PeerRoom from './pages/PeerRoom'; 
import WaitingRoom from './components/WaitingRoom'; 
import TopicSuggestion from './components/WaitingRoom';
import ChatBox from './components/ChatBox'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= GIAI ĐOẠN 1: CÔNG KHAI ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= GIAI ĐOẠN 2: TEST & SETUP (KHÔNG SIDEBAR) ================= */}
        {/* Đưa ra ngoài LearnerLayout để ẩn hoàn toàn thanh bên trái */}
        <Route path="/speaking-test" element={<SpeakingTest />} />
        <Route path="/setup" element={<ProfileSetupPage />} />

        {/* ================= GIAI ĐOẠN 3: APP CHÍNH (CÓ SIDEBAR) ================= */}
        {/* Chỉ những trang nằm trong Route này mới hiển thị Sidebar từ LearnerLayout */}
        <Route element={<LearnerLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/ai-practice" element={<AIPracticePage />} />
          <Route path="/peer-room" element={<PeerRoom />} />
          <Route path="/gamification" element={<GamificationDashboard />} />
          
          {/* Các route bổ sung */}
          <Route path="/my-courses" element={<div>Trang Khóa học (Đang phát triển)</div>} />
          <Route path="/schedule" element={<div>Trang Lịch học (Đang phát triển)</div>} />
        </Route>

        {/* ================= CÁC ROUTE KHÁC ================= */}
        <Route path="/admin" element={<h1>Khu vực Admin</h1>} />
        <Route path="/test-speech" element={<TestSpeechPage />} />
        <Route path="/peer/find" element={<PeerFindPage />} />
        <Route path="/peer/create" element={<CreateRoomPage />} />
        <Route path="/peer/room/:roomId" element={<PeerRoomPage />} />
        <Route path="/practice" element={<PracticeRoomPage />} />
        
        {/* Placeholder components */}
        <Route path="/waiting-room" element={<WaitingRoom />} />
        <Route path="/topic-suggestion" element={<TopicSuggestion />} />
        <Route path="/chat-box" element={<ChatBox />} />

        {/* Catch-all: Chuyển hướng về login nếu sai đường dẫn */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;