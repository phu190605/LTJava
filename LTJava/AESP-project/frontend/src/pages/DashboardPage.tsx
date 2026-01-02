import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <h2>Tổng quan hệ thống</h2>
      
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số bài học"
              value={120}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={93}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 40 }}>
        <p>Chào mừng bạn quay trở lại! Đây là nơi bạn sẽ quản lý nội dung học tập.</p>
        {/* ✅ Nút điều hướng sang SpeakingTest */}
        <Button type="primary" onClick={() => navigate('/speaking-test')}>
          Bắt đầu Speaking Test
        </Button>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;