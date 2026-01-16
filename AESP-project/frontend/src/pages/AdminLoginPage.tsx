import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

const onFinish = async (values: any) => {
  setLoading(true);
  try {
    const res: any = await axiosClient.post("/auth/login", {
      email: values.email,
      password: values.password,
    });

    const token = res.token || res.accessToken;
    const role = res.role || res.user?.role;

    if (!token || !role) {
      message.error("Đăng nhập không hợp lệ");
      return;
    }

    if (role !== "ADMIN") {
      message.error("Tài khoản này không có quyền Admin");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(res.user || {}));

    message.success("Xin chào Admin!");
    window.location.href = "/admin"; 

  } catch (err: any) {
    message.error(err.response?.data?.message || "Sai email hoặc mật khẩu");
  } finally {
    setLoading(false);
  }
};

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card
                title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SafetyOutlined style={{ color: '#1890ff' }} /> Đăng nhập Quản Trị</div>}
                style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                {/* Fix lỗi Warning Alert: Dùng description thay vì message cho nội dung dài */}
                <Alert
                    message="Khu vực hạn chế"
                    description="Chỉ dành cho quản trị viên hệ thống."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20 }}
                />

                <Form name="admin-login" onFinish={onFinish} layout="vertical">
                    <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', height: 40 }} loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    
                    <div style={{ textAlign: 'center' }}>
                        <a href="/login">Quay lại trang chủ</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AdminLoginPage;