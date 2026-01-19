import React, { useEffect, useState } from 'react';
import {
    Row, Col, Card, Button, Typography, Modal,
    Form, Input, InputNumber, Switch, message, Popconfirm, List, Badge, Spin
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    CheckOutlined, SketchOutlined, CrownFilled
} from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Interface khớp với Backend
interface ServicePackage {
    packageId?: number;
    packageName: string;
    price: number;
    durationMonths: number;
    description: string;
    features: string;
    hasMentor: boolean;
    active: boolean;
}

const PackageManager: React.FC = () => {
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

    // Khởi tạo Form instance
    const [form] = Form.useForm();

    // 1. Lấy dữ liệu
    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res: any = await axiosClient.get('/service-packages');
            setPackages(res);
        } catch (error) {
            message.error("Không thể tải danh sách gói");
        } finally {
            setLoading(false);
        }
    };

    // 2. Mở Modal
    const handleOpenModal = (pkg?: ServicePackage) => {
        setIsModalOpen(true);
        if (pkg) {
            setEditingPackage(pkg);
            // Fill dữ liệu vào form
            form.setFieldsValue(pkg);
        } else {
            setEditingPackage(null);
            form.resetFields();
            form.setFieldsValue({
                hasMentor: false,
                active: true,
                durationMonths: 1,
                features: '["Tính năng cơ bản"]'
            });
        }
    };

    // 3. Lưu (Thêm/Sửa)
    const handleSave = async (values: ServicePackage) => {
        try {
            setLoading(true);
            // Validate JSON
            try {
                JSON.parse(values.features);
            } catch {
                message.error('Features phải là chuỗi JSON. Ví dụ: ["Học 24/7", "Có Mentor"]');
                setLoading(false);
                return;
            }

            if (editingPackage?.packageId) {
                await axiosClient.put(`/service-packages/${editingPackage.packageId}`, values);
                message.success('Cập nhật thành công!');
            } else {
                await axiosClient.post('/service-packages', values);
                message.success('Tạo gói mới thành công!');
            }
            setIsModalOpen(false);
            fetchPackages();
        } catch (error: any) {
            // Check lỗi 403 để báo rõ hơn
            if (error.response && error.response.status === 403) {
                message.error('Bạn không có quyền thực hiện (Cần role ADMIN)');
            } else {
                message.error('Có lỗi xảy ra!');
            }
        } finally {
            setLoading(false);
        }
    };

    // 4. Xóa
    const handleDelete = async (id: number) => {
        try {
            await axiosClient.delete(`/service-packages/${id}`);
            message.success('Đã xóa gói!');
            fetchPackages();
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                message.error('Quyền hạn không đủ để xóa!');
            } else {
                message.error('Xóa thất bại');
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>📦 Quản lý Gói Dịch Vụ</Title>
                    <Text type="secondary">Cấu hình các gói hiển thị bên trang Học viên</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => handleOpenModal()}
                    style={{ borderRadius: 8, height: 45 }}
                >
                    Thêm Gói Mới
                </Button>
            </div>

            {loading && packages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
            ) : (
                <Row gutter={[24, 24]}>
                    {packages.map((pkg) => {
                        const isPremium = pkg.price > 0;
                        let featureList: string[] = [];
                        try {
                            featureList = JSON.parse(pkg.features);
                        } catch {
                            featureList = [pkg.features];
                        }

                        return (
                            <Col xs={24} md={8} lg={8} key={pkg.packageId}>
                                {/* Giao diện giống hệt Learner */}
                                <Badge.Ribbon
                                    text={isPremium ? "Premium" : "Free"}
                                    color={isPremium ? "gold" : "blue"}
                                >
                                    <Card
                                        hoverable
                                        // Fix lỗi deprecated: dùng styles.body
                                        styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%' } }}
                                        style={{
                                            height: '100%',
                                            borderRadius: 12,
                                            border: isPremium ? '1px solid #faad14' : '1px solid #f0f0f0',
                                            background: isPremium ? '#fffbe6' : '#fff'
                                        }}
                                    >
                                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                            {isPremium ?
                                                <CrownFilled style={{ fontSize: 40, color: '#faad14' }} /> :
                                                <SketchOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                                            }
                                            <Title level={3} style={{ marginTop: 10 }}>{pkg.packageName}</Title>
                                            <Title level={2} style={{ margin: 0, color: isPremium ? '#d48806' : '#000' }}>
                                                {formatCurrency(pkg.price)}
                                            </Title>
                                            <Text type="secondary">/ {pkg.durationMonths} tháng</Text>
                                        </div>

                                        <List
                                            size="small"
                                            split={false}
                                            dataSource={[
                                                pkg.hasMentor ? "Có Mentor hỗ trợ 1-1" : "Không có Mentor",
                                                ...featureList,
                                                pkg.description
                                            ].filter(Boolean)}
                                            renderItem={item => (
                                                <List.Item>
                                                    <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} /> {item}
                                                </List.Item>
                                            )}
                                        />

                                        {/* Actions cho Admin */}
                                        <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', gap: 10, borderTop: '1px dashed #d9d9d9' }}>
                                            <Button
                                                icon={<EditOutlined />}
                                                style={{ flex: 1 }}
                                                onClick={() => handleOpenModal(pkg)}
                                            >
                                                Sửa
                                            </Button>
                                            <Popconfirm
                                                title="Xóa gói này?"
                                                description="Hành động này không thể hoàn tác!"
                                                onConfirm={() => handleDelete(pkg.packageId!)}
                                                okText="Xóa"
                                                cancelText="Hủy"
                                            >
                                                <Button danger icon={<DeleteOutlined />} style={{ flex: 1 }}>
                                                    Xóa
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Modal Form - Fix lỗi useForm */}
            <Modal
                title={editingPackage ? "✏️ Chỉnh sửa gói" : "✨ Thêm gói mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
                destroyOnClose // Reset form khi đóng modal
            >
                {/* QUAN TRỌNG: Gán form instance vào đây */}
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        name="packageName"
                        label="Tên gói"
                        rules={[{ required: true, message: 'Nhập tên gói!' }]}
                    >
                        <Input placeholder="VD: Gói VIP" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Giá (VND)"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="durationMonths"
                                label="Thời hạn (Tháng)"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={1} max={36} style={{ width: '100%' }} size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Mô tả ngắn">
                        <Input.TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        name="features"
                        label="Các tính năng (JSON List)"
                        tooltip='Nhập dạng: ["Tính năng A", "Tính năng B"]'
                        rules={[{ required: true }]}
                    >
                        <TextArea rows={4} placeholder='["Học không giới hạn", "Hỗ trợ 24/7"]' />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="hasMentor" label="Kèm Mentor" valuePropName="checked">
                                <Switch checkedChildren="Có" unCheckedChildren="Không" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                                <Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ textAlign: 'right', marginTop: 10 }}>
                        <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 10 }}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingPackage ? "Lưu thay đổi" : "Tạo gói"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default PackageManager;