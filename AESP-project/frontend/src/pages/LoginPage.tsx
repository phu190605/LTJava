
import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // 1. Gọi API đăng nhập
      const res: any = await axiosClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      console.log("Kết quả API trả về:", res); 

      // 2. Kiểm tra và Lưu dữ liệu
      if (res.token) {
        localStorage.setItem('token', res.token);
        // Lưu toàn bộ object user bao gồm cả isTested và level
        localStorage.setItem('user', JSON.stringify(res));

        message.success('Đăng nhập thành công!');

        // 3. LOGIC ĐIỀU HƯỚNG THÔNG MINH
        if (res.role === 'ADMIN') {
          navigate('/admin');
        } else if (res.role === 'MENTOR') {
          navigate('/mentor');
        } else {
          // KIỂM TRA TRẠNG THÁI TEST TỪ BACKEND TRẢ VỀ
          if (res.isTested === true) {
            // Nếu đã test rồi -> Vào thẳng Dashboard
            message.info("Chào mừng quay trở lại!");
            navigate('/dashboard'); 
          } else {
            // Nếu chưa test (isTested = false hoặc 0) -> Bắt đi làm bài test
            navigate('/speaking-test');
          }
        }
      } else {
        message.error("Lỗi: Không nhận được Token từ server!");
      }

    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại!';
      message.error(errorMsg);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card title="AESP - Đăng nhập" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid #d9d9d9', paddingTop: 12 }}>
            <a href="/admin-login">Đăng nhập Admin</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;