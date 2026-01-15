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

// Interface khớp với Backend ServicePackage.java
interface ServicePackage {
    packageId?: number;
    packageName: string;
    price: number;
    durationMonths: number;
    description: string;
    features: string; // Lưu dạng chuỗi JSON
    hasMentor: boolean;
    active: boolean;
}

const PackageManager: React.FC = () => {
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
    const [form] = Form.useForm();

    // 1. Lấy dữ liệu từ API
    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            // Gọi API public để lấy danh sách
            const res: any = await axiosClient.get('/service-packages');
            setPackages(res);
        } catch (error) {
            message.error("Không thể tải danh sách gói");
        } finally {
            setLoading(false);
        }
    };

    // 2. Mở Modal Thêm/Sửa
    const handleOpenModal = (pkg?: ServicePackage) => {
        if (pkg) {
            setEditingPackage(pkg);
            form.setFieldsValue(pkg);
        } else {
            setEditingPackage(null);
            form.resetFields();
            // Giá trị mặc định
            form.setFieldsValue({ 
                hasMentor: false, 
                active: true, 
                durationMonths: 1,
                features: '["Tính năng 1", "Tính năng 2"]' // Gợi ý định dạng JSON
            });
        }
        setIsModalOpen(true);
    };

    // 3. Xử lý Lưu
    const handleSave = async (values: ServicePackage) => {
        try {
            setLoading(true);
            
            // Validate JSON features
            try {
                JSON.parse(values.features);
            } catch (e) {
                message.error('Trường "Tính năng" phải là chuỗi JSON hợp lệ (ví dụ: ["A", "B"])');
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
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng kiểm tra lại');
        } finally {
            setLoading(false);
        }
    };

    // 4. Xử lý Xóa
    const handleDelete = async (id: number) => {
        try {
            await axiosClient.delete(`/service-packages/${id}`);
            message.success('Đã xóa gói dịch vụ');
            fetchPackages();
        } catch (error) {
            message.error('Xóa thất bại');
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
                    <Text type="secondary">Cấu hình các gói học phí hiển thị cho học viên</Text>
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
                            featureList = ["Lỗi định dạng tính năng"];
                        }

                        return (
                            <Col xs={24} md={8} lg={8} key={pkg.packageId}>
                                <Badge.Ribbon
                                    text={isPremium ? "Premium" : "Free"}
                                    color={isPremium ? "gold" : "blue"}
                                >
                                    <Card
                                        hoverable
                                        style={{
                                            height: '100%',
                                            borderRadius: 12,
                                            border: isPremium ? '1px solid #faad14' : '1px solid #f0f0f0',
                                            background: isPremium ? '#fffbe6' : '#fff'
                                        }}
                                        bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
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
                                            ]}
                                            renderItem={item => (
                                                <List.Item>
                                                    <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} /> {item}
                                                </List.Item>
                                            )}
                                        />

                                        <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', gap: 10 }}>
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

            {/* Modal Form */}
            <Modal
                title={editingPackage ? "Chỉnh sửa gói" : "Thêm gói mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item 
                        name="packageName" 
                        label="Tên gói" 
                        rules={[{ required: true, message: 'Nhập tên gói!' }]}
                    >
                        <Input placeholder="VD: Gói Cơ Bản" size="large" />
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
                        label="Các tính năng (Định dạng JSON Array)" 
                        tooltip='Nhập danh sách tính năng trong ngoặc vuông. Ví dụ: ["Tính năng A", "Tính năng B"]'
                        rules={[{ required: true, message: 'Bắt buộc nhập tính năng' }]}
                    >
                        <TextArea rows={4} placeholder='["Xem video không giới hạn", "Làm bài tập AI", "Hỗ trợ 24/7"]' />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="hasMentor" label="Kèm Mentor" valuePropName="checked">
                                <Switch checkedChildren="Có" unCheckedChildren="Không" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="active" label="Trạng thái kích hoạt" valuePropName="checked">
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