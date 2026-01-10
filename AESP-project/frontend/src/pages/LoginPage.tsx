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
      // Lưu ý: Biến 'res' ở đây CHÍNH LÀ dữ liệu thật (do axiosClient đã xử lý)
      const res: any = await axiosClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      console.log("Kết quả API trả về:", res); // Soi dữ liệu để kiểm tra

      // 2. Kiểm tra và Lưu token
      // ⚠️ SỬA QUAN TRỌNG: Thay response.data.token bằng res.token
      if (res.token) {
        localStorage.setItem('token', res.token);
        // Lưu thông tin user (nếu cần dùng sau này)
        localStorage.setItem('user', JSON.stringify(res));

        message.success('Đăng nhập thành công!');

        // 3. Chuyển hướng (Cũng bỏ .data đi)
        if (res.role === 'ADMIN') {
          navigate('/admin');
        } else if (res.role === 'MENTOR') {
          navigate('/mentor');
        } else {
          navigate('/speaking-test'); // Mặc định: chuyển đến speaking-test
        }
      } else {
        // Trường hợp API không lỗi nhưng không trả về token
        message.error("Lỗi: Không nhận được Token từ server!");
      }

    } catch (error: any) {
      // 4. Xử lý lỗi
      console.error("Lỗi đăng nhập:", error);
      // Lấy thông báo lỗi từ backend trả về (nếu có)
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