import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy packageId được truyền từ trang Checkout sang
  const packageId = location.state?.packageId;

  // Gói Cơ bản (ID = 1) thì KHÔNG hiện nút AI
  const showAIButton = packageId && Number(packageId) > 1;

  // 👉 TỰ ĐỘNG CHUYỂN SANG TRANG HỌC VỚI MENTOR
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/learner/learnmentor');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Result
      status="success"
      title="Thanh toán thành công!"
      subTitle="Cảm ơn bạn đã nâng cấp tài khoản. Gói dịch vụ đã được kích hoạt ngay lập tức."
      extra={[
        <Button
          type="primary"
          key="home"
          onClick={() => navigate('/dashboard')}
        >
          Về trang chủ
        </Button>,

        showAIButton && (
          <Button
            key="ai"
            onClick={() => navigate('/ai-practice')}
          >
            Thử ngay tính năng AI
          </Button>
        ),
      ]}
    />
  );
};

export default PaymentSuccessPage;
