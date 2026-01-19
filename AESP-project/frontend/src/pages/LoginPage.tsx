import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import type { LoginResponse } from '../types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // ✅ CAST KIỂU RÕ RÀNG CHO TYPESCRIPT
      const data = (await axiosClient.post(
        '/auth/login',
        {
          email: values.email,
          password: values.password,
        }
      )) as LoginResponse;

      console.log('Kết quả API trả về:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));

        message.success('Đăng nhập thành công!');

        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else if (data.role === 'MENTOR') {
          navigate('/mentor');
        } else {
          navigate('/dashboard'); // LEARNER
        }
      } else {
        message.error('Lỗi: Không nhận được token từ server!');
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);

      const errorMsg =
        error?.response?.data ||
        error?.message ||
        'Đăng nhập thất bại!';

      message.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card title="AESP - Đăng nhập" style={{ width: 400 }}>
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>

          <div
            style={{
              textAlign: 'center',
              borderTop: '1px solid #d9d9d9',
              paddingTop: 12,
            }}
          >
            <a href="/admin-login">Đăng nhập Admin</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
