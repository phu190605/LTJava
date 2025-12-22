import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Hàm chạy khi bấm nút Đăng nhập Admin
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // 1. Gọi API đăng nhập admin
            const response = await axiosClient.post('/auth/admin/login', {
                email: values.email,
                password: values.password,
            });

            // 2. Kiểm tra nếu user không phải admin
            if (response.data.role !== 'ADMIN') {
                message.error('Bạn không có quyền truy cập admin!');
                setLoading(false);
                return;
            }

            // 3. Lưu token và thông tin user
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('role', response.data.role);

            message.success('Đăng nhập Admin thành công!');

            // 4. Chuyển hướng tới trang admin
            navigate('/admin');

        } catch (error: any) {
            // 5. Xử lý lỗi
            console.error(error);
            message.error(error.response?.data || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SafetyOutlined style={{ color: '#1890ff' }} />
                        <span>Đăng nhập Admin</span>
                    </div>
                }
                style={{ width: 400 }}
            >
                <Alert
                    message="Khu vực dành cho quản trị viên"
                    description="Chỉ các tài khoản admin mới có thể truy cập trang này."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20 }}
                />

                <Form
                    name="admin-login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', height: 40 }}
                            loading={loading}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <a href="/login">Quay lại đăng nhập thường</a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AdminLoginPage;
