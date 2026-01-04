import React, { useState } from 'react';
import { Card, Button, Input, Typography, Space, message, Divider } from 'antd';
import { SaveOutlined, SecurityScanOutlined, FileTextOutlined } from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const PolicyManager: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [terms, setTerms] = useState('');
    const [privacy, setPrivacy] = useState('');

    const handleSave = async () => {
        if (!terms || !privacy) {
            return message.warning('Vui lòng nhập đầy đủ nội dung chính sách!');
        }

        setLoading(true);
        try {
            axiosClient.post('/auth/policy', {
                type: 'TERMS',
                content: terms,
                version: null
            });

            axiosClient.post('/auth/policy', {
                type: 'PRIVACY',
                content: privacy,
                version: null
            });

            message.success('Cập nhật chính sách hệ thống thành công!');
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi lưu dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#e6f7ff', minHeight: '100vh' }}>
            <Card
                bordered={false}
                style={{
                    maxWidth: 800,
                    margin: '0 auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                {/* Header */}
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
                        <SecurityScanOutlined style={{ marginRight: 10 }} />
                        THIẾT LẬP CHÍNH SÁCH HỆ THỐNG
                    </Title>
                    <Paragraph type="secondary">
                        Admin soạn thảo luật chơi trước khi mở cửa cho người dùng.
                    </Paragraph>
                </Space>

                <Divider style={{ borderColor: '#91d5ff' }} />

                {/* Form */}
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Terms of Service */}
                    <div>
                        <Title level={5}>
                            <FileTextOutlined /> Điều khoản sử dụng (Terms of Service)
                        </Title>
                        <TextArea
                            rows={6}
                            placeholder="Nhập nội dung điều khoản để người dùng đồng ý khi tạo tài khoản..."
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    {/* Privacy Policy */}
                    <div>
                        <Title level={5}>
                            <SecurityScanOutlined /> Chính sách quyền riêng tư (Privacy Policy)
                        </Title>
                        <TextArea
                            rows={6}
                            placeholder="Nhập nội dung chính sách bảo mật thông tin..."
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    {/* Action */}
                    <div style={{ textAlign: 'right', marginTop: 20 }}>
                        <Text italic type="secondary" style={{ display: 'block', marginBottom: 10 }}>
                            * Kết quả: Nội dung này sẽ hiển thị tại màn hình Đăng ký của Learner.
                        </Text>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            size="large"
                            loading={loading}
                            onClick={handleSave}
                            style={{
                                borderRadius: 20,
                                paddingLeft: 30,
                                paddingRight: 30,
                                backgroundColor: '#1890ff'
                            }}
                        >
                            LƯU VÀO DATABASE
                        </Button>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default PolicyManager;
