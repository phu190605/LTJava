import React, { useEffect, useState } from 'react';
import { getStreakStats } from '../api/streakApi';
import {
    Row, Col, Card, Avatar, Typography, Progress, Tag, Timeline,
    Button, Skeleton, Space, Statistic, Alert
} from 'antd';
import {
    UserOutlined, CrownOutlined, RocketOutlined, ClockCircleOutlined,
    StarFilled, ThunderboltFilled, RightOutlined
} from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const MOCK_LEARNING_PATH = [
    { title: 'Bài 1: Làm quen & Chào hỏi', status: 'finish', desc: 'Hoàn thành xuất sắc' },
    { title: 'Bài 2: Giới thiệu bản thân', status: 'process', desc: 'Đang học dở dang' },
    { title: 'Bài 3: Từ vựng mua sắm', status: 'wait', desc: 'Chưa mở khóa' },
];
const getBadgeInfo = (xp: number) => {
    if (xp <= 100) return { name: 'Mầm non', color: 'green', icon: '🌱' };
    if (xp <= 500) return { name: 'Học giả', color: 'blue', icon: '📚' };
    return { name: 'Bậc thầy', color: 'purple', icon: '💎' };
};

const DashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [streak, setStreak] = useState<number>(0);
    const [totalXp, setTotalXp] = useState<number>(0);

    const fetchTotalXp = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            console.log('[DASHBOARD] userId localStorage:', userId);
            if (!userId) {
                console.log('[DASHBOARD] Không có userId, set XP = 0');
                setTotalXp(0);
                return;
            }
            const res = await axiosClient.get(`/gamification/stats/${userId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }) as { totalXp: number };
            console.log('[DASHBOARD] XP API response:', res);
            const xp = res.totalXp || 0;
            console.log('[DASHBOARD] setTotalXp sẽ set:', xp);
            setTotalXp(xp);
            setTimeout(() => {
                console.log('[DASHBOARD] totalXp sau setState:', xp);
            }, 100);
        } catch (e) {
            console.log('[DASHBOARD] Lỗi fetchTotalXp, set XP = 0', e);
            setTotalXp(0);
        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API lấy dữ liệu thật từ Backend
                const res: any = await axiosClient.get('/profile/dashboard');
                setData(res);
                // Lấy userId từ localStorage hoặc context
                let userId = localStorage.getItem('userId');
                if (!userId || isNaN(Number(userId))) {
                    setStreak(0);
                } else {
                    // Lấy streak như cũ
                    const streakRes = await getStreakStats(Number(userId));
                    setStreak(streakRes.currentStreak ?? 0);
                }
                // Luôn gọi lấy XP
                await fetchTotalXp();
            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: 24 }}><Skeleton active avatar paragraph={{ rows: 6 }} /></div>;
    }
    // -- TÍNH TOÁN HUY HIỆU HIỆN TẠI ---
    const currentBadge = getBadgeInfo(totalXp);

    return (
        <div>
            {/* 1. HEADER BANNER: Thông tin cá nhân & Level */}
            <Card
                style={{
                    background: 'linear-gradient(135deg, #001529 0%, #1890ff 100%)',
                    border: 'none',
                    color: 'white',
                    borderRadius: 12,
                    marginBottom: 24,
                    boxShadow: '0 4px 20px rgba(24, 144, 255, 0.2)'
                }}
            >
                <Row align="middle" gutter={[24, 24]}>
                    <Col>
                        <Avatar
                            size={80}
                            src={data?.avatarUrl}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#fff', color: '#1890ff', border: '3px solid rgba(255,255,255,0.3)' }}
                        />
                    </Col>
                    <Col flex="auto">
                        <Text style={{ color: 'rgba(255,255,255,0.85)' }}>Chào mừng trở lại,</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <Title level={2} style={{ color: 'white', margin: '4px 0 12px 0' }}>
                            {data?.fullName || "Học viên AESP"}
                        </Title>
                        <Tag color={currentBadge.color} style={{
                                borderRadius: 20,
                                padding: '4px 12px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                border: '2px solid white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}>
                                <span style={{ fontSize: '16px' }}>{currentBadge.icon}</span>
                                {currentBadge.name}
                            </Tag>
                            </div>

                        <Space size="middle" wrap>
                            <Tag color="#52c41a" style={{ padding: '4px 12px', borderRadius: 20, fontSize: 14, border: 'none' }}>
                                <StarFilled /> Level: {data?.currentLevel}
                            </Tag>
                            <Tag color="geekblue" style={{ padding: '4px 12px', borderRadius: 20, fontSize: 14, border: 'none' }}>
                                <RocketOutlined /> Mục tiêu: {data?.mainGoal}
                            </Tag>
                            <Tag style={{ padding: '4px 12px', borderRadius: 20, fontSize: 14, border: 'none', background: '#f5f7fa', color: '#e74c3c', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: 18, marginRight: 6 }}>🔥</span>
                                <span style={{ fontWeight: 600 }}>Streak</span>
                                <span style={{ margin: '0 4px', color: '#2c3e50', fontWeight: 700 }}>{streak} Days</span>
                            </Tag>
                            <Tag style={{ padding: '4px 12px', borderRadius: 20, fontSize: 14, border: 'none', background: '#f5f7fa', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                                    <path d="M12 2L2 9l10 13 10-13-10-7z" stroke="#1890ff" strokeWidth="2" fill="none" />
                                </svg>
                                <span style={{ fontWeight: 600 }}>XP</span>
                                <span style={{ margin: '0 4px', color: '#222', fontWeight: 700 }}>{totalXp}</span>
                            </Tag>
                        </Space>
                    </Col>

                    {/* Nút tắt để sửa hồ sơ */}
                    <Col>
                        <Button ghost shape="round" onClick={() => navigate('/settings')}>
                            Cập nhật hồ sơ
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[24, 24]}>

                {/* ================= CỘT TRÁI (NỘI DUNG HỌC TẬP) ================= */}
                <Col xs={24} lg={16}>

                    {/* 2. Sở thích & Chủ đề quan tâm */}
                    <Card title="Chủ đề bạn quan tâm" style={{ borderRadius: 12, marginBottom: 24 }}>
                        {data?.interests && data.interests.length > 0 ? (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {data.interests.map((topic: string, index: number) => (
                                    <Tag key={index} color="blue" style={{ padding: '6px 14px', fontSize: 14, borderRadius: 6 }}>
                                        #{topic}
                                    </Tag>
                                ))}
                            </div>
                        ) : (
                            <Alert message="Bạn chưa chọn chủ đề yêu thích" type="info" showIcon action={
                                <Button size="small" type="link" onClick={() => navigate('/setup')}>Chọn ngay</Button>
                            } />
                        )}
                    </Card>

                    {/* 3. Lộ trình học (Tạm thời dùng Mock Data) */}
                    <Card
                        title={<><ThunderboltFilled style={{ color: '#faad14' }} /> Lộ trình học tập tiếp theo</>}
                        style={{ borderRadius: 12 }}
                    >
                        <Timeline
                            style={{ marginTop: 10 }}
                            items={MOCK_LEARNING_PATH.map(item => ({
                                color: item.status === 'finish' ? 'green' : item.status === 'process' ? 'blue' : 'gray',
                                dot: item.status === 'process' ? <ClockCircleOutlined style={{ fontSize: '18px', color: '#1890ff' }} /> : null,
                                children: (
                                    <div style={{ paddingBottom: 12 }}>
                                        <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                                        <div style={{ margin: '4px 0' }}><Text type="secondary">{item.desc}</Text></div>
                                        {item.status === 'process' && (
                                            <Button type="primary" size="small" style={{ borderRadius: 12, marginTop: 4 }}>
                                                Học tiếp <RightOutlined />
                                            </Button>
                                        )}
                                    </div>
                                ),
                            }))}
                        />
                    </Card>
                </Col>

                {/* ================= CỘT PHẢI (WIDGET & GÓI CƯỚC) ================= */}
                <Col xs={24} lg={8}>

                    {/* 4. Mục tiêu ngày */}
                    <Card style={{ borderRadius: 12, marginBottom: 24, textAlign: 'center' }}>
                        <Title level={5} style={{ marginBottom: 16 }}>Mục tiêu hôm nay</Title>
                        <div style={{ marginBottom: 16 }}>
                            <Progress
                                type="dashboard"
                                percent={Math.round(((data?.learnedMinutes || 0) / (data?.dailyGoalMinutes || 30)) * 100)}
                                strokeColor="#1890ff"
                                gapDegree={60}
                            />
                        </div>
                        <Statistic
                            title="Thời gian đã học"
                            value={data?.learnedMinutes || 0}
                            suffix={`/ ${data?.dailyGoalMinutes} phút`}
                            valueStyle={{ fontSize: 18, fontWeight: 'bold' }}
                        />
                    </Card>

                    {/* 5. Thông tin Gói dịch vụ (Subscription) */}
                    <Card
                        style={{
                            borderRadius: 12,
                            border: '1px solid #faad14',
                            background: '#fffbe6',
                            textAlign: 'center'
                        }}
                    >
                        <CrownOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 12 }} />
                        <Title level={4} style={{ color: '#d48806', margin: 0 }}>
                            {data?.packageName || "Chưa đăng ký"}
                        </Title>

                        <div style={{ margin: '16px 0', borderTop: '1px dashed #d48806', borderBottom: '1px dashed #d48806', padding: '12px 0' }}>
                            <Text strong style={{ display: 'block' }}>
                                Hạn sử dụng: <span style={{ color: '#d48806' }}>{data?.daysLeft} ngày</span>
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {data?.hasMentor ? "✅ Đã có Mentor hỗ trợ" : "❌ Chưa có Mentor"}
                            </Text>
                        </div>

                        <Button
                            type="primary"
                            block
                            shape="round"
                            size="large"
                            style={{ background: '#d48806', borderColor: '#d48806', fontWeight: 'bold' }}
                            // Bấm vào sẽ dẫn sang trang Lịch sử thanh toán để xem chi tiết hoặc nâng cấp
                            onClick={() => navigate('/payment-history')}
                        >
                            Quản lý gói & Nâng cấp
                        </Button>
                    </Card>

                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;