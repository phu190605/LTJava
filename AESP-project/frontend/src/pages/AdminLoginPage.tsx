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
            // BƯỚC 1: Đăng nhập bình thường để lấy Token
            // Lưu ý: Dùng endpoint /auth/login (chuẩn) thay vì /auth/admin/login
            const res: any = await axiosClient.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            // Lấy token an toàn (chấp nhận mọi cấu trúc trả về)
            const token = res.token || res.data?.token || res.accessToken;

            if (!token) {
                message.error('Không nhận được Token từ hệ thống!');
                setLoading(false);
                return;
            }

            // Lưu tạm token
            localStorage.setItem('token', token);

            // BƯỚC 2: "PING" thử vào API Admin để kiểm tra quyền
            // Nếu gọi được nghĩa là User này là Admin
            try {
                await axiosClient.get('/admin/mentors'); 
                
                // ✅ THÀNH CÔNG: Đây là Admin
                // Lưu thông tin User
                localStorage.setItem('user', JSON.stringify(res.user || res.data?.user || {}));
                localStorage.setItem('role', 'ADMIN');

                message.success('Xin chào Admin!');
                
                // Chuyển trang bằng window.location để reset sạch state cũ
                window.location.href = '/admin/packages'; //test goi bang admin

            } catch (err) {
                // ❌ THẤT BẠI: Đây là Learner hoặc Token lỗi
                localStorage.clear(); // Xóa sạch
                message.error('Tài khoản này không có quyền truy cập Admin!');
            }

        } catch (error: any) {
            console.error(error);
            // Fix lỗi Alert deprecated message
            message.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng');
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