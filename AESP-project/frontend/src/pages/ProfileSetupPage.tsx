import React, { useState } from 'react';
import { Steps, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

import LearningGoal from '../components/LearningGoal';
import GoalSelection from '../components/GoalSelection';
import PreferenceSetup from '../components/PreferenceSetup';

const ProfileSetupPage: React.FC = () => {
  // Bắt đầu từ 0 (tương ứng với LearningGoal)
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Chỉ giữ lại 3 bước: Mục tiêu -> Sở thích -> Lộ trình
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

  // 2. Gửi dữ liệu về Backend (Xử lý Logic điều hướng Mới)
  const handleFinalSubmit = async (finalData: any) => {
    try {
      setLoading(true);
      // finalData: Dữ liệu từ component PreferenceSetup gửi ra (Bao gồm packageId, price...)
      const allData = { ...formData, ...finalData };

      console.log("DỮ LIỆU SETUP GỬI ĐI:", allData);

      // Gọi API setup để lưu thông tin vào DB trước
      await axiosClient.post('/profile/setup', allData);

      // --- LOGIC ĐIỀU HƯỚNG MỚI ---
      // Kiểm tra xem gói vừa chọn có phải gói trả phí không (price > 0)
      if (finalData.price > 0 && finalData.packageId) {
        message.info("Vui lòng thanh toán để kích hoạt lộ trình!");
        
        // Chuyển sang trang Checkout kèm ID gói
        setTimeout(() => {
          navigate(`/checkout/${finalData.packageId}`);
        }, 1000);
      } else {
        // Nếu là gói miễn phí (hoặc không có giá) -> Vào thẳng Dashboard
        message.success("Thiết lập lộ trình thành công!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }

    } catch (error: any) {
      console.error(error);
      message.error("Lỗi: " + (error.response?.data || "Vui lòng thử lại sau"));
    } finally {
      setLoading(false);
    }
  };

  // 3. Render các Component tương ứng với 3 bước
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