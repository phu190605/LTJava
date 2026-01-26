import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SpeakingTest from './pages/SpeakingTest';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage'; 
import ProfileSetupPage from './pages/ProfileSetupPage'; 
import SettingsPage from './pages/SettingsPage'; 
import PaymentHistoryPage from './pages/PaymentHistoryPage'; 
import SubscriptionPage from './pages/SubscriptionPage'; 
import AIPracticePage from './pages/AIPracticePage'; 
import LearnerLayout from './layouts/LearnerLayout'; 
import TestSpeechPage from './pages/TestSpeechPage'; // Đã import
import PracticeRoomPage from './pages/PracticeRoomPage';
import GamificationDashboard from './pages/GamificationDashboard';
import PeerRoom from './pages/PeerRoom'; 
import WaitingRoom from './components/WaitingRoom'; 
import TopicSuggestion from './components/TopicSuggestion'; 
import ChatBox from './components/ChatBox'; 

// Import Peer pages
import PeerFindPage from './pages/PeerFindPage'; 
import CreateRoomPage from './pages/CreateRoomPage';
import PeerRoomPage from './pages/PeerRoomPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= NHÓM 1: PUBLIC ROUTES ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Trang Test Speech được đặt ở Public để dễ dàng kiểm tra thiết bị */}
        <Route path="/test-speech" element={<TestSpeechPage />} />
        
        {/* ================= NHÓM 2: KHẢO SÁT (KHÔNG SIDEBAR) ================= */}
        <Route path="/speaking-test" element={<SpeakingTest />} />

        {/* ================= NHÓM 3: APP CHÍNH (CÓ SIDEBAR QUA LEARNERLAYOUT) ================= */}
        <Route element={<LearnerLayout />}>
          {/* Dashboard & Profile Setup */}
          <Route path="/setup" element={<ProfileSetupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Luyện tập & AI */}
          <Route path="/ai-practice" element={<AIPracticePage />} />
          <Route path="/practice" element={<PracticeRoomPage />} />
          <Route path="/gamification" element={<GamificationDashboard />} />
          
          {/* Peer to Peer (Học nhóm) */}
          <Route path="/peer-room" element={<PeerRoom />} />
          <Route path="/peer/find" element={<PeerFindPage />} />
          <Route path="/peer/create" element={<CreateRoomPage />} />
          <Route path="/peer/room/:roomId" element={<PeerRoomPage />} />
          
          {/* Tài khoản & Cài đặt */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          
          {/* Placeholder nội dung đang phát triển */}
          <Route path="/my-courses" element={<div className="p-4">Trang Khóa học (Đang phát triển)</div>} />
          <Route path="/schedule" element={<div className="p-4">Trang Lịch học (Đang phát triển)</div>} />
        </Route>

        {/* ================= NHÓM 4: ADMIN & COMPONENTS TEST ================= */}
        <Route path="/admin" element={<div className="p-10 text-center"><h1>Khu vực Quản trị hệ thống</h1></div>} />
        <Route path="/waiting-room" element={<WaitingRoom />} />
        <Route path="/topic-suggestion" element={<TopicSuggestion />} />
        <Route path="/chat-box" element={<ChatBox />} />

        {/* Điều hướng mặc định: Nếu đường dẫn không tồn tại, về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;