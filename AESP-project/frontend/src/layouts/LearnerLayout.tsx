import React, { useEffect, useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Space, theme, Dropdown } from 'antd';
// Import MenuProps để chuẩn TypeScript Antd v6
import type { MenuProps } from 'antd';
import {
    HomeOutlined, ReadOutlined, AimOutlined,
    CalendarOutlined, SettingOutlined, UserOutlined,
    LogoutOutlined, HistoryOutlined, CrownOutlined,
    TeamOutlined, MessageOutlined // <--- THÊM ICON CHO TÌM BẠN VÀ PHÒNG CHAT
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
        fetchUserInfo();
    }, []);

    // --- DANH SÁCH MENU BÊN TRÁI ---
    const menuItems = [
        { key: '/dashboard', icon: <HomeOutlined />, label: 'Tổng quan' },
        { key: '/ai-practice', icon: <AudioOutlined />, label: 'Luyện nói AI (Premium)' },
        
        // --- THÊM 2 MỤC ĐIỀU HƯỚNG MỚI ---
        { key: '/peer-room', icon: <TeamOutlined />, label: 'Tìm bạn học' },
        { key: '/practice', icon: <MessageOutlined />, label: 'Phòng luyện tập' },
        // --------------------------------

        { key: '/my-courses', icon: <ReadOutlined />, label: 'Khoá học của tôi' },
        { key: '/setup', icon: <AimOutlined />, label: 'Mục tiêu & Lộ trình' },
        { key: '/schedule', icon: <CalendarOutlined />, label: 'Lịch học' },
        

        // --- THÊM MỤC NÀY ---
        {
            key: '/subscription',
            icon: <CrownOutlined style={{ color: '#faad14' }} />, // Màu vàng cho nổi bật
            label: 'Nâng cấp tài khoản'
        },
        // --------------------

        { key: '/payment-history', icon: <HistoryOutlined />, label: 'Lịch sử thanh toán' },
        { type: 'divider' as const },
        { key: '/settings', icon: <SettingOutlined />, label: 'Cài đặt' },
        { key: '/login', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === '/login') {
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            navigate(key);
        }
    };

    // Menu Dropdown User (Góc phải trên)
    const userMenuItems: MenuProps['items'] = [
        { key: '/settings', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
        { key: '/subscription', label: 'Nâng cấp VIP', icon: <CrownOutlined style={{ color: '#faad14' }} /> }, // Thêm cả vào đây cho tiện
        { type: 'divider' },
        { key: '/login', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true }
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