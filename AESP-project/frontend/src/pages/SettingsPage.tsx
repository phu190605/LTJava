import React from 'react';
import { Card, Typography } from 'antd';
import SettingsForm from '../components/SettingsForm';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Cài đặt tài khoản</Title>
        <SettingsForm />
      </Card>
    </div>
  );
};

export default SettingsPage;