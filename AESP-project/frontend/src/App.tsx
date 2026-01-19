import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import AdminLoginPage from "./pages/AdminLoginPage";

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
import ProfileSetupPage from "./pages/ProfileSetupPage";
import SettingsPage from "./pages/SettingsPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import AIPracticePage from "./pages/AIPracticePage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import LearnMentorPage from "./pages/learner/LearnMentorPage";

/* ===== MENTOR ===== */
import MentorDashboard from "./pages/mentor/MentorDashboard";
import FeedbackList from "./pages/mentor/FeedbackList";
import Materials from "./pages/mentor/Materials";
import MentorProfile from "./pages/mentor/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
          <Route path="feedback" element={<FeedbackList />} />
          <Route path="materials" element={<Materials />} />
          <Route path="profile" element={<MentorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
