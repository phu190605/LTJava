/* uth.edu package */
import React, { useState } from 'react';
import { Steps, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

import LearningGoal from '../components/LearningGoal';
import GoalSelection from '../components/GoalSelection';
import PreferenceSetup from '../components/PreferenceSetup';

const ProfileSetupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const items = [
    { title: 'Mục tiêu', subTitle: 'Động lực học' },
    { title: 'Sở thích', subTitle: 'Chủ đề quan tâm' },
    { title: 'Lộ trình', subTitle: 'Gói học tập' },
  ];

  const handleNext = (data: any) => {
    const updated = { ...formData, ...data };
    setFormData(updated);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (finalData: any) => {
    try {
      setLoading(true);
      const allData = { ...formData, ...finalData };

      console.log("DỮ LIỆU SETUP GỬI ĐI:", allData);

      // 1. Gọi API gửi dữ liệu setup lên Backend
      await axiosClient.post('/profile/setup', allData);

      // 2. 🔹 CẬP NHẬT LOCALSTORAGE ĐỂ "MỞ KHÓA" DASHBOARD
      // Chúng ta cần đánh dấu isSetupComplete = true để LearnerLayout cho phép truy cập Sidebar
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, isSetupComplete: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      message.success("Thiết lập lộ trình thành công! Chào mừng bạn.");

      // 3. 🔹 ĐIỀU HƯỚNG VỀ DASHBOARD
      // Chuyển hướng sau 1 giây để người dùng kịp thấy thông báo thành công
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error: any) {
      console.error(error);
      message.error("Lỗi: " + (error.response?.data || "Vui lòng thử lại sau"));
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <LearningGoal onNext={handleNext} onBack={handleBack} />;
      case 1:
        return <GoalSelection onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PreferenceSetup onSubmit={handleFinalSubmit} onBack={handleBack} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '40px 20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Steps
          current={currentStep}
          items={items}
          style={{ marginBottom: 40, padding: '0 20px' }}
        />

        <div className="setup-content-wrapper" style={{ minHeight: 400 }}>
          {renderContent()}
        </div>
      </Card>
    </div>
  );
};

export default ProfileSetupPage;