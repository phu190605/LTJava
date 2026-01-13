import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy packageId được truyền từ trang Checkout sang
  // Nếu người dùng truy cập trực tiếp (không qua checkout), giá trị này sẽ là undefined
  const packageId = location.state?.packageId;

  // Logic: Gói Cơ bản (ID = 1) thì KHÔNG hiện nút AI
  // Gói 2, 3... thì hiện.
  // Nếu không biết gói nào (undefined) thì ẩn cho an toàn.
  const showAIButton = packageId && Number(packageId) > 1;

  return (
    <Result
      status="success"
      title="Thanh toán thành công!"
      subTitle="Cảm ơn bạn đã nâng cấp tài khoản. Gói dịch vụ đã được kích hoạt ngay lập tức."
      extra={[
        <Button 
          type="primary" 
          key="console" 
          onClick={() => navigate('/dashboard')}
        >
          Về trang chủ
        </Button>,
        
        // Chỉ render nút này nếu là gói Cao cấp (ID > 1)
        showAIButton && (
          <Button 
            key="buy" 
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