import React from 'react';
import { Form, Input, Button, message, Card, Select } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // Gọi API đăng ký
      await axiosClient.post('/auth/register', {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: values.role // Gửi kèm role người dùng chọn
      });

      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login'); // Chuyển ngay sang trang Login

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Đăng ký thất bại!';
      message.error(errorMsg);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card title="AESP - Đăng ký tài khoản" style={{ width: 450 }}>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ role: 'LEARNER' }}
        >
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập Họ tên!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          {/* Chọn vai trò: Học viên hay Mentor */}
          <Form.Item name="role" label="Bạn muốn đăng ký là:">
            <Select size="large">
              <Select.Option value="LEARNER">Học viên (Learner)</Select.Option>
              <Select.Option value="MENTOR">Người hướng dẫn (Mentor)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>
              Đăng ký ngay
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;