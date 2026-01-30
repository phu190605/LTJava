import React, { useEffect, useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Space, theme, Dropdown } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

// Import MenuProps để chuẩn TypeScript Antd v6
import type { MenuProps } from 'antd';
import {
    HomeOutlined, ReadOutlined, AimOutlined,
    CalendarOutlined, SettingOutlined, UserOutlined,TrophyOutlined,
    LogoutOutlined, HistoryOutlined, CrownOutlined, RocketOutlined // <--- THÊM ICON VƯƠNG MIỆN VÀ ROCKET
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const LearnerLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer } } = theme.useToken();

    const [userInfo, setUserInfo] = useState<{ fullName: string; avatarUrl: string } | null>(null);


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

        // 1. Gọi lần đầu khi vào trang
        fetchUserInfo();

        // 2. Lắng nghe sự kiện "user-updated" từ SettingsForm bắn sang
        const handleUpdate = () => {
            fetchUserInfo(); // Gọi lại API để cập nhật Avatar mới ngay lập tức
        };

        window.addEventListener('user-updated', handleUpdate);

        // 3. Dọn dẹp khi thoát trang (Bắt buộc để tránh lỗi)
        return () => {
            window.removeEventListener('user-updated', handleUpdate);
        };
    }, []);

    const menuItems = [
        { key: '/dashboard', icon: <HomeOutlined />, label: 'Tổng quan' },
        { key: '/ai-practice', icon: <AudioOutlined />, label: 'Luyện nói AI (Premium)' },
        { key: '/setup', icon: <AimOutlined />, label: 'Mục tiêu & Lộ trình' },

        { key: '/learner/learnmentor', icon: <TeamOutlined />, label: 'Đăng ký mentor' },
        { key: '/gamification', icon: <RocketOutlined style={{ color: '#f80606' }} />, label: 'Thử thách' },


        {
            key: '/subscription',
            icon: <CrownOutlined style={{ color: '#faad14' }} />, // Màu vàng cho nổi bật
            label: 'Nâng cấp tài khoản'
        },
        {
            key: '/leaderboard',
            icon: <TrophyOutlined style={{ color: '#faad14' }} />, // Icon cái cúp màu vàng
            label: 'Bảng xếp hạng'
        },
        // --------------------

        { key: '/payment-history', icon: <HistoryOutlined />, label: 'Lịch sử thanh toán' },
        { type: 'divider' as const },
        { key: '/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
        { key: '/', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === '/') {
            localStorage.removeItem('token');
            navigate('/');
        } else {
            navigate(key);
        }
    };

    // Menu Dropdown User (Góc phải trên)
    const userMenuItems: MenuProps['items'] = [
        { key: '/settings', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
        { key: '/subscription', label: 'Nâng cấp VIP', icon: <CrownOutlined style={{ color: '#faad14' }} /> },
        { type: 'divider' },
        { key: '/', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
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

            <Layout>
                <Header style={{ background: colorBgContainer, padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
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

                <Content style={{ margin: '24px', overflow: 'initial' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LearnerLayout;