import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axiosClient from '../api/axiosClient';

type LearnerProfile = {
  user?: { fullName?: string; email?: string };
  // có thể có thêm các trường khác nhưng không cần cho form này
};

const SettingsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load dữ liệu thật từ backend
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // axiosClient đã bóc response.data => trả về trực tiếp LearnerProfile
        const profile: LearnerProfile = await axiosClient.get('/profile/me');
        form.setFieldsValue({
          displayName: profile?.user?.fullName || '',
          email: profile?.user?.email || '',
        });
      } catch (e: any) {
        const msg = e?.response?.data || e?.message || 'Không tải được thông tin tài khoản';
        message.error(typeof msg === 'string' ? msg : 'Không tải được thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      // Backend chỉ cập nhật displayName -> User.fullName
      await axiosClient.put('/profile/update-info', {
        displayName: values.displayName,
      });

      // Cập nhật lại localStorage nếu app đọc tên từ đây
      const storedUserStr = localStorage.getItem('user');
      if (storedUserStr) {
        try {
          const stored = JSON.parse(storedUserStr);
          stored.fullName = values.displayName;
          localStorage.setItem('user', JSON.stringify(stored));
        } catch {}
      }

      message.success('Đã lưu thay đổi');
    } catch (e: any) {
      const msg = e?.response?.data || e?.message || 'Lưu thay đổi thất bại';
      message.error(typeof msg === 'string' ? msg : 'Lưu thay đổi thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên hiển thị"
          name="displayName"
          rules={[{ required: true, message: 'Nhập tên hiển thị' }]}
        >
          <Input placeholder="Nhập tên hiển thị" />
        </Form.Item>

        {/* Email hiển thị tham khảo (backend hiện chưa cập nhật email ở update-info) */}
        <Form.Item label="Email" name="email">
          <Input placeholder="Email (chỉ hiển thị)" disabled />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default SettingsForm;