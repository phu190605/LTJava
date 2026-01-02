import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Hàm chạy khi bấm nút Đăng nhập
  const onFinish = async (values: any) => {
    try {
      // 1. Gọi API đăng nhập
      const response = await axiosClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      // 2. Nếu thành công -> Lưu token và thông tin user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      message.success('Đăng nhập thành công!');

      // 3. Chuyển hướng dựa vào Role
      if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.data.role === 'MENTOR') {
        navigate('/mentor');
      } else {
        navigate('/dashboard'); // Mặc định là Learner
      }

    } catch (error: any) {
      // 4. Xử lý lỗi
      console.error(error);
      message.error(error.response?.data || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card title="AESP - Đăng nhập" style={{ width: 400 }}>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
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