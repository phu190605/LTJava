import React from 'react';
import LandingLayout from '../layouts/LandingLayout';
import { Button, Row, Col, Card, Typography, Avatar, Tag } from 'antd';
import {
  CheckCircleFilled,
  AudioOutlined,
  RobotOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createLearningPath } from '../api/learningPathApi';

const { Title, Paragraph, Text } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // 👉 GỌI BACKEND TẠO LỘ TRÌNH HỌC
  const handleAssessment = async () => {
    try {
      const result = await createLearningPath();
      console.log('Learning path created:', result);

      // Sau khi tạo lộ trình học thành công
      navigate('/learning-path');
    } catch (error) {
      console.error(error);
      alert('Không thể tạo lộ trình học. Vui lòng thử lại.');
    }
  };

  return (
    <LandingLayout>
      {/* HERO SECTION */}
      <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[60, 40]} align="middle">
          <Col xs={24} md={12}>
            <Tag
              color="blue"
              style={{
                fontSize: 14,
                padding: '5px 10px',
                marginBottom: 20,
                borderRadius: 20,
              }}
            >
              🚀 Công nghệ AI tiên tiến nhất
            </Tag>

            <Title level={1} style={{ fontSize: 48, fontWeight: 800 }}>
              Nói tiếng Anh tự tin <br /> cùng trợ lý AI & Mentor
            </Title>

            <Paragraph
              style={{
                fontSize: 18,
                color: '#666',
                marginBottom: 40,
                marginTop: 20,
              }}
            >
              Luyện tập mọi lúc mọi nơi, phản hồi phát âm tức thì.
              Lộ trình cá nhân hóa giúp bạn giỏi lên trông thấy.
            </Paragraph>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <Button
                type="primary"
                size="large"
                style={{
                  height: 56,
                  padding: '0 40px',
                  fontSize: 18,
                  backgroundColor: '#2B4DFF',
                  borderRadius: 8,
                }}
                onClick={handleAssessment}
              >
                KIỂM TRA TRÌNH ĐỘ NGAY
              </Button>

              <Text strong>Miễn phí 7 ngày</Text>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <img
              src="https://img.freepik.com/free-photo/group-diverse-people-having-business-meeting_53876-25060.jpg"
              alt="Studying"
              style={{
                width: '100%',
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            />
          </Col>
        </Row>
      </div>

      {/* TÍNH NĂNG */}
      <div style={{ background: '#F8F9FF', padding: '100px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2}>Tính năng vượt trội</Title>
            <Paragraph>AI + Mentor đồng hành cùng bạn</Paragraph>
          </div>

          <Row gutter={[30, 30]}>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, background: '#E6F0FF', border: 'none' }}>
                <AudioOutlined style={{ fontSize: 30 }} />
                <Title level={4}>AI Grader</Title>
                <Paragraph>Chấm điểm phát âm chính xác.</Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, background: '#F3E6FF', border: 'none' }}>
                <RobotOutlined style={{ fontSize: 30 }} />
                <Title level={4}>Real-time Practice</Title>
                <Paragraph>Hội thoại AI 24/7.</Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, background: '#FFE6EF', border: 'none' }}>
                <UsergroupAddOutlined style={{ fontSize: 30 }} />
                <Title level={4}>1-on-1 Coaching</Title>
                <Paragraph>Mentor đồng hành.</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* GIÁO VIÊN */}
      <div style={{ background: '#F9FAFB', padding: '80px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2}>Đội ngũ giáo viên AESP</Title>

          <Row gutter={[30, 30]} style={{ marginTop: 50 }}>
            {[1, 2, 3].map((item) => (
              <Col xs={24} md={8} key={item}>
                <Card hoverable>
                  <Avatar size={100} src={`https://i.pravatar.cc/150?img=${item + 10}`} />
                  <Title level={4}>Johnson</Title>
                  <Text type="secondary">USA</Text>
                  <div style={{ marginTop: 10 }}>
                    <Tag color="blue">Business English</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </LandingLayout>
  );
};

export default LandingPage;
