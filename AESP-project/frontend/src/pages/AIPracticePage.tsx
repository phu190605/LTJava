import React, { useEffect, useState } from 'react';
import { Button, Result, Card, Typography, Spin, Row, Col } from 'antd';
import { LockOutlined, AudioOutlined, CrownFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const AIPracticePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    const [currentPackage, setCurrentPackage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        try {
            // 1. Gọi API lấy thông tin Profile hiện tại
            const res: any = await axiosClient.get('/profile/dashboard');
            setCurrentPackage(res.packageName);

            // 2. Logic phân quyền: Chỉ gói "Cao Cấp" hoặc "Chuyên Nghiệp" mới được vào
            // (Bạn có thể sửa logic này tùy theo tên gói trong DB của bạn)
            if (res.packageName === 'Gói Cao Cấp' || res.packageName === 'Gói Chuyên Nghiệp') {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    // --- TRƯỜNG HỢP 1: BỊ CHẶN (GÓI FREE) ---
    if (!isAllowed) {
        return (
            <Result
                icon={<LockOutlined style={{ color: '#ff4d4f' }} />}
                title="Tính năng giới hạn cho Hội viên Premium"
                subTitle={`Gói hiện tại của bạn (${currentPackage}) không hỗ trợ tính năng Luyện nói AI 1-1.`}
                extra={[
                    <Button
                        type="primary"
                        key="upgrade"
                        shape="round"
                        size="large"
                        icon={<CrownFilled />}
                        style={{ background: '#d48806', borderColor: '#d48806' }}
                        onClick={() => navigate('/subscription')} // Dẫn về trang mua gói
                    >
                        Nâng cấp ngay
                    </Button>,
                    <Button key="back" onClick={() => navigate('/dashboard')}>
                        Quay lại Dashboard
                    </Button>,
                ]}
            />
        );
    }

    // --- TRƯỜNG HỢP 2: ĐƯỢC PHÉP TRUY CẬP (GÓI PREMIUM) ---
    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <Card style={{ textAlign: 'center', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <AudioOutlined style={{ fontSize: 60, color: '#1890ff', marginBottom: 20 }} />
                <Title level={2}>Phòng Luyện Nói AI</Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                    Chào mừng hội viên <strong>{currentPackage}</strong>! <br />
                    Hệ thống AI đang lắng nghe, hãy bắt đầu nói...
                </Text>

                <div style={{ marginTop: 40, padding: 40, background: '#f0f5ff', borderRadius: 12 }}>
                    <div className="wave-animation">Developing... (Chỗ này sau sẽ tích hợp AI)</div>
                </div>

                <Button type="primary" size="large" style={{ marginTop: 30 }}>
                    Bắt đầu ghi âm
                </Button>
            </Card>
        </div>
    );
};

export default AIPracticePage;