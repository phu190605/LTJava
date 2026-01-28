import { BrowserRouter, Routes, Route } from "react-router-dom";


/* ===== LAYOUT ===== */
import AdminLayout from "./layouts/AdminLayout";
import LearnerLayout from "./layouts/LearnerLayout";
import MentorLayout from "./layouts/MentorLayout";

/* ===== ADMIN ===== */
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import MentorManager from "./pages/admin/MentorManager";
import PolicyManager from "./pages/admin/PolicyManager";
import PackageManager from "./pages/admin/PackageManager";
import PurchaseManager from "./pages/admin/PurchaseManager";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminReportPage from "./pages/admin/AdminReport";

/* ===== LEARNER ===== */
import DashboardPage from "./pages/DashboardPage";
import LearnMentorPage from "./pages/learner/LearnMentorPage";
import WithMentorPage from "./pages/learner/WithMentorPage";

/* ===== MENTOR ===== */
import MentorDashboard from "./pages/mentor/MentorDashboard";
import Materials from "./pages/mentor/Materials";
import MentorProfile from "./pages/mentor/Profile";
import PlacementReviewPage from "./pages/mentor/PlacementReviewPage";
import ReviewSpeakingResult from "./pages/ReviewSpeakingResult";
import ReviewAllResults from "./pages/ReviewAllResults";
import MentorLearnersPage from "./pages/mentor/MentorLearnersPage";

/* ===== AUTH & PUBLIC PAGES ===== */
import LoginPage from './pages/LoginPage';
import SpeakingTest from './pages/SpeakingTest';
import AdminLoginPage from './pages/AdminLoginPage';
import LandingPage from './pages/LandingPage'; // <--- Import trang mới
import ProfileSetupPage from './pages/ProfileSetupPage'; // trang thiết lập hồ sơ, mục tiu
import SettingsPage from './pages/SettingsPage'; // trang cài đặt tài khoản
import PaymentHistoryPage from './pages/PaymentHistoryPage'; //  trang lịch sử thanh toán
import SubscriptionPage from './pages/SubscriptionPage'; // trang Quản lý gói học
import AIPracticePage from './pages/AIPracticePage'; //  trang Luyện nói AI 1-1
import CheckoutPage from './pages/CheckoutPage';// trang Thanh toán
import PaymentSuccessPage from './pages/PaymentSuccessPage';// trang Kết quả thanh toán
import LeaderboardPage from "./pages/LeaderboardPage"; // trang Bảng xếp hạng
import TestSpeechPage from './pages/TestSpeechPage';
import PeerFindPage from './pages/PeerFindPage';
import PeerRoomPage from './pages/PeerRoomPage';
import CreateRoomPage from './pages/CreateRoomPage';
import PracticeRoomPage from './pages/PracticeRoomPage';
import GamificationDashboard from './pages/GamificationDashboard';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* ===== LEARNER ===== */}
        <Route element={<LearnerLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/setup" element={<ProfileSetupPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/ai-practice" element={<AIPracticePage />} />
          <Route path="/checkout/:packageId" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/learner/learnmentor" element={<LearnMentorPage />} />
          <Route path="/learner/with-mentor" element={<WithMentorPage />} />
          <Route path="/gamification" element={<GamificationDashboard />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />

        </Route>

        {/* ===== ADMIN ===== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="mentors" element={<MentorManager />} />
          <Route path="packages" element={<PackageManager />} />
          <Route path="purchases" element={<PurchaseManager />} />
          <Route path="policies" element={<PolicyManager />} />
          <Route path="reports" element={<AdminReportPage />} />
        </Route>


        {/* ===== MENTOR ===== */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<MentorDashboard />} />
          <Route path="materials" element={<Materials />} />
          <Route path="profile" element={<MentorProfile />} />
          <Route path="/mentor/learners" element={<MentorLearnersPage />} />

          <Route path="placement-review" element={<PlacementReviewPage />} />
        </Route>

        <Route path="/review-speaking-result/:userId" element={<ReviewSpeakingResult />} />
        <Route path="/review-all-results/:userId" element={<ReviewAllResults />} />
        <Route path="/my-courses" element={<div>Trang Khóa học (Đang phát triển)</div>} />

        <Route path="/speaking-test" element={<SpeakingTest />} />
        <Route path="/test-speech" element={<TestSpeechPage />} />
        <Route path="/peer/find" element={<PeerFindPage />} />
        <Route path="/peer/create" element={<CreateRoomPage />} />
        <Route path="/peer/room/:roomId" element={<PeerRoomPage />} />
        <Route path="/practice" element={<PracticeRoomPage />} />
        <Route path="/gamification" element={<GamificationDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
