import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <h2>Tổng quan hệ thống</h2>
      
      {/* Ví dụ về các thẻ thống kê */}
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
      </div>
    </MainLayout>
  );
};

export default DashboardPage;