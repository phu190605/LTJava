import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Typography, Tag, List, message, Spin, Badge } from 'antd';
import { CheckOutlined, CrownFilled, SketchOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface PackageData {
    packageId: number;
    packageName: string;
    price: number;
    description: string;
    hasMentor: boolean;
    features: string; // Giả sử features lưu dạng chuỗi JSON hoặc text
    active: boolean; // Thêm trường active để nhận biết gói ẩn/hiện
}

const SubscriptionPage: React.FC = () => {
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [currentPackageId, setCurrentPackageId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Lấy danh sách gói
            const resPackages: any = await axiosClient.get('/subscription/packages');
            setPackages(resPackages);

            // 2. Lấy thông tin user để biết đang dùng gói nào
            const resProfile: any = await axiosClient.get('/profile/dashboard');
            // Tìm packageId tương ứng với tên gói (Cách này tạm thời, chuẩn là Backend trả về ID)
            const foundPkg = resPackages.find((p: any) => p.packageName === resProfile.packageName);
            if (foundPkg) setCurrentPackageId(foundPkg.packageId);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (pkgId: number, pkgName: string) => {
        try {
            setLoading(true);
            // Gọi API nâng cấp
            await axiosClient.post('/subscription/upgrade', { packageId: pkgId });

            message.success(`Chúc mừng! Bạn đã nâng cấp lên gói ${pkgName}`);

            // Reload lại data để cập nhật giao diện
            fetchData();

            // Chuyển hướng về Dashboard sau 1s
            setTimeout(() => navigate('/dashboard'), 1500);

        } catch (error) {
            message.error("Nâng cấp thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && packages.length === 0) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <Title level={2}>Chọn gói phù hợp với lộ trình của bạn</Title>
                <Text type="secondary">Nâng cấp để mở khóa tính năng Mentor 1-kèm-1 và lộ trình cá nhân hóa</Text>
            </div>

            <Row gutter={[24, 24]} justify="center">
                {packages
                .filter(pkg => pkg.active !== false) //  QUAN TRỌNG: Lọc bỏ các gói đang ẩn
                .map((pkg) => {
                    const isCurrent = pkg.packageId === currentPackageId;
                    const isPremium = pkg.price > 0; // Giả định gói trả phí là Premium

                    // Parse features từ JSON string (để đồng bộ với cách lưu mới của Admin)
                        let featureList: string[] = [];
                        try {
                            featureList = JSON.parse(pkg.features);
                        } catch {
                            // Fallback nếu dữ liệu cũ không phải JSON
                            featureList = [pkg.features]; 
                        }
                    return (
                        <Col xs={24} md={8} key={pkg.packageId}>
                            <Badge.Ribbon
                                text={isCurrent ? "Đang dùng" : (isPremium ? "Phổ biến" : "Miễn phí")}
                                color={isCurrent ? "green" : (isPremium ? "gold" : "blue")}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        height: '100%',
                                        borderRadius: 12,
                                        border: isCurrent ? '2px solid #52c41a' : (isPremium ? '1px solid #faad14' : '1px solid #f0f0f0'),
                                        background: isPremium ? '#fffbe6' : '#fff'
                                    }}
                                    bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                                >
                                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                        {isPremium ? <CrownFilled style={{ fontSize: 40, color: '#faad14' }} /> : <SketchOutlined style={{ fontSize: 40, color: '#1890ff' }} />}
                                        <Title level={3} style={{ marginTop: 10 }}>{pkg.packageName}</Title>
                                        <Title level={2} style={{ margin: 0, color: isPremium ? '#d48806' : '#000' }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                                        </Title>
                                        <Text type="secondary">/ tháng</Text>
                                    </div>

                                    <List
                                        size="small"
                                        split={false}
                                        dataSource={[
                                            pkg.hasMentor ? "Có Mentor hỗ trợ 1-1" : "Không có Mentor",
                                            "Lộ trình học cá nhân hóa",
                                            "Truy cập không giới hạn bài học",
                                            pkg.description
                                        ]}
                                        renderItem={item => (
                                            <List.Item>
                                                <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} /> {item}
                                            </List.Item>
                                        )}
                                    />

                                    <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                                        <Button
                                            type={isCurrent ? "default" : "primary"}
                                            block
                                            size="large"
                                            shape="round"
                                            disabled={isCurrent}
                                            style={{
                                                background: isCurrent ? '#f6ffed' : (isPremium ? '#d48806' : '#1890ff'),
                                                borderColor: isCurrent ? '#b7eb8f' : (isPremium ? '#d48806' : '#1890ff'),
                                                color: isCurrent ? '#52c41a' : '#fff',
                                                fontWeight: 'bold'
                                            }}
                                            onClick={() => navigate(`/checkout/${pkg.packageId}`)}
                                        >
                                            {isCurrent ? "Gói hiện tại" : "Nâng cấp ngay"}
                                        </Button>
                                    </div>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default SubscriptionPage;