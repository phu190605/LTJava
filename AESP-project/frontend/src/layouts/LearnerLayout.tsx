import React, { useEffect, useState } from 'react';
import { 
    AudioOutlined, HomeOutlined, ReadOutlined, AimOutlined, 
    CalendarOutlined, SettingOutlined, UserOutlined, 
    LogoutOutlined, HistoryOutlined, CrownOutlined, 
    TeamOutlined, MessageOutlined 
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Typography, Space, theme, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const LearnerLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer } } = theme.useToken();
    const [userInfo, setUserInfo] = useState<{ fullName: string; avatarUrl: string } | null>(null);

    // --- 1. LẤY DỮ LIỆU TRẠNG THÁI ---
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isSetupDone = storedUser.isSetupComplete === true;
    const isCurrentlySettingUp = location.pathname === "/setup";

    // --- 2. ĐIỀU HƯỚNG BẮT BUỘC (ROUTE GUARDS) ---
    // Phải kiểm tra điều kiện trước khi fetch dữ liệu để tránh lỗi API
    if (!storedUser.isTested) {
        return <Navigate to="/speaking-test" replace />;
    }

    if (!isSetupDone && !isCurrentlySettingUp) {
        return <Navigate to="/setup" replace />;
    }

    // --- 3. FETCH THÔNG TIN NGƯỜI DÙNG ---
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Chỉ gọi API nếu đã đăng nhập và đã qua các bước bắt buộc
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
    }, [location.pathname]); // Re-fetch nếu chuyển trang để cập nhật avatar/tên mới nhất

    // --- 4. CẤU HÌNH MENU ---
    const menuItems = [
        { key: '/dashboard', icon: <HomeOutlined />, label: 'Tổng quan' },
        { key: '/test-speech', icon: <AudioOutlined />, label: 'Luyện nói AI (Premium)' },
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
        { key: '/', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === '/') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } else {
            navigate(key);
        }
    };

    const userMenuItems: MenuProps['items'] = [
        { key: '/settings', label: 'Hồ sơ cá nhân', icon: <UserOutlined /> },
        { key: '/subscription', label: 'Nâng cấp VIP', icon: <CrownOutlined style={{ color: '#faad14' }} /> },
        { type: 'divider' },
        { key: '/', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar chỉ xuất hiện khi ĐÃ hoàn thành setup mục tiêu */}
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
                    margin: isSetupDone ? '24px' : '0', 
                    padding: isSetupDone ? '0' : '40px 0', 
                    overflow: 'initial',
                    transition: 'all 0.3s'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LearnerLayout;