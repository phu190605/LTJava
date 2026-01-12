
import React, { useEffect, useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Space, theme, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
    HomeOutlined, ReadOutlined, AimOutlined,
    CalendarOutlined, SettingOutlined, UserOutlined,
    LogoutOutlined, HistoryOutlined, CrownOutlined,
    TeamOutlined, MessageOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const LearnerLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer } } = theme.useToken();

    const [userInfo, setUserInfo] = useState<{ fullName: string; avatarUrl: string } | null>(null);

    // --- LOGIC KIỂM TRA TRẠNG THÁI NGƯỜI DÙNG ---
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Kiểm tra xem đã hoàn thành setup chưa (dựa trên URL hoặc localStorage)
    const isSetupDone = storedUser.isSetupComplete === true;
    const isCurrentlySettingUp = location.pathname === "/setup";

    // 1. Nếu chưa từng làm Speaking Test -> Buộc quay về trang test
    if (!storedUser.isTested) {
        return <Navigate to="/speaking-test" replace />;
    }

    // 2. Nếu cố tình vào Dashboard mà chưa xong Setup -> Đẩy về Setup
    if (!isSetupDone && !isCurrentlySettingUp) {
        return <Navigate to="/setup" replace />;
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res: any = await axiosClient.get('/profile/dashboard');
                setUserInfo({
                    fullName: res.fullName,
                    avatarUrl: res.avatarUrl
                });
            } catch (error) {
                console.error("Lỗi lấy thông tin Header:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const menuItems = [
        { key: '/dashboard', icon: <HomeOutlined />, label: 'Tổng quan' },
        { key: '/ai-practice', icon: <AudioOutlined />, label: 'Luyện nói AI (Premium)' },
        { key: '/peer-room', icon: <TeamOutlined />, label: 'Tìm bạn học' },
        { key: '/practice', icon: <MessageOutlined />, label: 'Phòng luyện tập' },
        { key: '/my-courses', icon: <ReadOutlined />, label: 'Khoá học của tôi' },
        { key: '/setup', icon: <AimOutlined />, label: 'Mục tiêu & Lộ trình' },
        { key: '/schedule', icon: <CalendarOutlined />, label: 'Lịch học' },
        {
            key: '/subscription',
            icon: <CrownOutlined style={{ color: '#faad14' }} />, 
            label: 'Nâng cấp tài khoản'
        },
        { key: '/payment-history', icon: <HistoryOutlined />, label: 'Lịch sử thanh toán' },
        { type: 'divider' as const },
        { key: '/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
        { key: '/login', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === '/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } else {
            navigate(key);
        }
    };

    const userMenuItems: MenuProps['items'] = [
        { key: '/settings', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
        { key: '/subscription', label: 'Nâng cấp VIP', icon: <CrownOutlined style={{ color: '#faad14' }} /> },
        { type: 'divider' },
        { key: '/login', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* CHỈ HIỆN SIDEBAR KHI ĐÃ XONG SETUP HOẶC KHÔNG PHẢI TRANG SETUP LẦN ĐẦU */}
            {isSetupDone && (
                <Sider width={260} theme="light" breakpoint="lg" collapsedWidth="0" style={{ borderRight: '1px solid #f0f0f0' }}>
                    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ color: '#1890ff', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                            AESP LEARNER
                        </Title>
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        style={{ borderRight: 0, marginTop: 10 }}
                    />
                </Sider>
            )}

            <Layout>
                <Header style={{ 
                    background: colorBgContainer, 
                    padding: '0 24px', 
                    display: 'flex', 
                    justifyContent: isSetupDone ? 'flex-end' : 'space-between', 
                    alignItems: 'center', 
                    borderBottom: '1px solid #f0f0f0' 
                }}>
                    {/* Nếu chưa xong setup, hiện Logo ở Header để đỡ trống */}
                    {!isSetupDone && (
                         <Title level={4} style={{ color: '#1890ff', margin: 0 }}>AESP LEARNER</Title>
                    )}

                    <Dropdown
                        menu={{
                            items: userMenuItems,
                            onClick: handleMenuClick
                        }}
                        placement="bottomRight"
                        arrow
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                                <Text strong style={{ display: 'block' }}>{userInfo?.fullName || "Học viên"}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>Người dùng</Text>
                            </div>
                            <Avatar
                                src={userInfo?.avatarUrl}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                        </Space>
                    </Dropdown>
                </Header>

                <Content style={{ 
                    margin: isSetupDone ? '24px' : '0', // Full màn hình nếu đang setup
                    padding: isSetupDone ? '0' : '40px 0', 
                    overflow: 'initial' 
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LearnerLayout;