import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin, DatePicker, Select, Row, Col, Card, Avatar } from 'antd';
import { UserOutlined, LinkOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import dayjs from 'dayjs';

const SettingsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // 1. Lấy dữ liệu thực tế từ API /profile/me
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // API trả về đối tượng ProfileResponseRequest
        const data: any = await axiosClient.get('/profile/me');

        // Đưa dữ liệu vào Form
        form.setFieldsValue({
          ...data,
          // Chuyển đổi Date từ Backend sang đối tượng dayjs cho DatePicker
          dob: data.dob ? dayjs(data.dob) : null,
        });
        // Lưu url ảnh vào state để hiển thị preview
        setAvatarUrl(data.avatarUrl);
      } catch (e: any) {
        const errorMsg = e.response?.data?.message || "Không thể tải hồ sơ. Vui lòng thiết lập lộ trình trước.";
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [form]);

  // 2. Gửi dữ liệu cập nhật về API /profile/update-info
  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        // Chuyển định dạng ngày về YYYY-MM-DD để Backend nhận kiểu Date
        dob: values.dob ? values.dob.toDate() : null,
        // Đảm bảo gửi avatarUrl về Backend
        avatarUrl: values.avatarUrl
      };

      await axiosClient.post('/profile/update-info', payload);
      message.success('Thông tin hồ sơ đã được lưu vào Database!');

      // Cập nhật lại state hiển thị để chắc chắn
      setAvatarUrl(values.avatarUrl);
      // Bắn tín hiệu "user-updated" ra toàn hệ thống
      window.dispatchEvent(new Event('user-updated'));

    } catch (e: any) {
      message.error('Cập nhật thất bại: ' + (e.response?.data || 'Lỗi hệ thống'));
    } finally {
      setSaving(false);
    }
  };

  // Hàm xử lý khi người dùng nhập link ảnh -> Hiện preview ngay
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(e.target.value);
  };

  return (
    <Spin spinning={loading} tip="Đang kết nối dữ liệu thực tế...">
      <Card title="Cài đặt tài khoản học tập" bordered={false} style={{ borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
{/* --- KHU VỰC ĐỔI AVATAR (MỚI) --- */}
            <Col span={24} style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ marginBottom: 15 }}>
                  <Avatar 
                    size={100} 
                    src={avatarUrl} 
                    icon={<UserOutlined />} 
                    style={{ border: '2px solid #1890ff' }}
                  />
                </div>
                
                <div style={{ maxWidth: 400, margin: '0 auto' }}>
                    <Form.Item 
                        name="avatarUrl" 
                        label="Đường dẫn ảnh đại diện (URL)"
                        help="Bạn có thể copy link ảnh từ Facebook hoặc Google rồi dán vào đây."
                    >
                        <Input 
                            prefix={<LinkOutlined />} 
                            placeholder="https://example.com/my-avatar.jpg" 
                            onChange={handleAvatarChange} // Gọi hàm preview khi nhập
                        />
                    </Form.Item>
                </div>
            </Col>
            {/* -------------------------------- */}

            {/* Thông tin định danh (Chỉ đọc) */}
            <Col xs={24} md={12}>
              <Form.Item label="Email tài khoản" name="email">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Họ tên đăng ký" name="fullName">
                <Input disabled />
              </Form.Item>
            </Col>

            {/* Thông tin cá nhân hóa (Có thể chỉnh sửa) */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên hiển thị (Nickname)"
                name="displayName"
                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
              >
                <Input placeholder="Tên hiện trên Dashboard" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input placeholder="Số điện thoại liên lạc" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Ngày sinh" name="dob">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Giới tính" name="gender">
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="MALE">Nam</Select.Option>
                  <Select.Option value="FEMALE">Nữ</Select.Option>
                  <Select.Option value="OTHER">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Nghề nghiệp" name="occupation">
                <Input placeholder="Ví dụ: Sinh viên, Người đi làm..." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Button type="primary" htmlType="submit" loading={saving} block size="large">
                LƯU THAY ĐỔI VÀO DATABASE
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Spin>
  );
};

export default SettingsForm;