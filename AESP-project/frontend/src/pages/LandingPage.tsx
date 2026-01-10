import React from 'react';
import LandingLayout from '../layouts/LandingLayout';
import { Button, Row, Col, Card, Typography, Avatar, Tag } from 'antd';
import { CheckCircleFilled, AudioOutlined, RobotOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LandingLayout>
      {/* 1. HERO SECTION (Banner đầu trang) */}
      <div style={{ padding: '80px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[60, 40]} align="middle">
          <Col xs={24} md={12}>
            <Tag color="blue" style={{ fontSize: '14px', padding: '5px 10px', marginBottom: 20, borderRadius: 20 }}>
              🚀 Công nghệ AI tiên tiến nhất
            </Tag>
            <Title level={1} style={{ fontSize: '48px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>
              Nói tiếng Anh tự tin <br/> cùng trợ lý AI & Mentor
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: 40, marginTop: 20 }}>
              Luyện tập mọi lúc mọi nơi, phản hồi phát âm tức thì. Lộ trình cá nhân hóa giúp bạn giỏi lên trông thấy.
            </Paragraph>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <Button type="primary" size="large" style={{ height: '56px', padding: '0 40px', fontSize: '18px', backgroundColor: '#2B4DFF', borderRadius: '8px' }} onClick={() => navigate('/register')}>
                Kiểm tra trình độ ngay
              </Button>
              <Text strong>Miễn phí 7 ngày</Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            {/* Ảnh minh họa: Bạn thay link ảnh thật vào đây */}
            <img 
              src="https://img.freepik.com/free-photo/group-diverse-people-having-business-meeting_53876-25060.jpg" 
              alt="Studying" 
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
            />
          </Col>
        </Row>
      </div>

      {/* 2. TÍNH NĂNG VƯỢT TRỘI (3 ô màu: Xanh, Tím, Hồng) */}
      <div style={{ background: '#F8F9FF', padding: '100px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2}>Tính năng vượt trội</Title>
            <Paragraph style={{ fontSize: 16 }}>Kết hợp công nghệ AI và Mentor giàu kinh nghiệm</Paragraph>
          </div>

          <Row gutter={[30, 30]}>
            {/* Card 1: AI Grader (Xanh dương) */}
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, height: '100%', background: '#E6F0FF', border: 'none' }} bodyStyle={{ padding: 40 }}>
                <div style={{ width: 60, height: 60, background: '#2B4DFF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <AudioOutlined style={{ fontSize: 30, color: 'white' }} />
                </div>
                <Title level={4}>AI Grader</Title>
                <Paragraph>Chấm điểm phát âm chính xác từng âm tiết. Công nghệ AI phân tích giọng nói và sửa lỗi ngay lập tức.</Paragraph>
              </Card>
            </Col>

            {/* Card 2: Real-time Practice (Tím) */}
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, height: '100%', background: '#F3E6FF', border: 'none' }} bodyStyle={{ padding: 40 }}>
                <div style={{ width: 60, height: 60, background: '#9D4DFF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <RobotOutlined style={{ fontSize: 30, color: 'white' }} />
                </div>
                <Title level={4}>Real-time Practice</Title>
                <Paragraph>Hội thoại không giới hạn với AI. Luyện phản xạ giao tiếp 24/7 với các tình huống thực tế đa dạng.</Paragraph>
              </Card>
            </Col>

             {/* Card 3: 1-on-1 Coaching (Hồng) */}
             <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, height: '100%', background: '#FFE6EF', border: 'none' }} bodyStyle={{ padding: 40 }}>
                <div style={{ width: 60, height: 60, background: '#FF4D82', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <UsergroupAddOutlined style={{ fontSize: 30, color: 'white' }} />
                </div>
                <Title level={4}>1-on-1 Coaching</Title>
                <Paragraph>Kết nối với giáo viên bản xứ khi cần học chuyên sâu. Nhận feedback cá nhân và lộ trình riêng biệt.</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* 3. BẢNG GIÁ (Pricing) */}
      <div style={{ padding: '100px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>Bảng giá linh hoạt</Title>
        <Row gutter={[30, 30]} align="middle">
          {/* Gói Cơ bản */}
          <Col xs={24} md={8}>
            <Card style={{ borderRadius: 20, textAlign: 'center', padding: 20 }}>
              <Title level={4}>Cơ bản</Title>
              <Title level={2}>200,000đ<span style={{ fontSize: 16, fontWeight: 'normal' }}>/tháng</span></Title>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginTop: 30, marginBottom: 30 }}>
                <li><CheckCircleFilled style={{ color: '#52c41a' }} /> AI Practice không giới hạn</li>
                <li><CheckCircleFilled style={{ color: '#52c41a' }} /> Chấm điểm phát âm</li>
              </ul>
              <Button size="large" style={{ width: '100%', borderRadius: 8 }}>Chọn gói này</Button>
            </Card>
          </Col>

          {/* Gói Chuyên nghiệp (Nổi bật) */}
          <Col xs={24} md={8}>
            <Card 
              style={{ borderRadius: 20, textAlign: 'center', padding: 30, background: '#2B4DFF', color: 'white', transform: 'scale(1.05)', boxShadow: '0 20px 40px rgba(43, 77, 255, 0.3)' }}
              bordered={false}
            >
              <Tag color="#FFD700" style={{ fontWeight: 'bold', color: 'black', marginBottom: 10 }}>PHỔ BIẾN NHẤT</Tag>
              <Title level={4} style={{ color: 'white' }}>Chuyên nghiệp</Title>
              <Title level={2} style={{ color: 'white' }}>550,000đ<span style={{ fontSize: 16, fontWeight: 'normal', color: 'rgba(255,255,255,0.8)' }}>/tháng</span></Title>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginTop: 30, marginBottom: 30, color: 'white' }}>
                <li style={{ marginBottom: 10 }}>✅ Tất cả tính năng Cơ bản</li>
                <li style={{ marginBottom: 10 }}>✅ 2 buổi Mentor/tháng</li>
                <li style={{ marginBottom: 10 }}>✅ Báo cáo tiến độ chi tiết</li>
              </ul>
              <Button size="large" style={{ width: '100%', borderRadius: 8, color: '#2B4DFF', fontWeight: 'bold' }}>Chọn gói này</Button>
            </Card>
          </Col>

          {/* Gói Cao cấp */}
          <Col xs={24} md={8}>
            <Card style={{ borderRadius: 20, textAlign: 'center', padding: 20 }}>
              <Title level={4}>Cao cấp</Title>
              <Title level={2}>999,000đ<span style={{ fontSize: 16, fontWeight: 'normal' }}>/tháng</span></Title>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginTop: 30, marginBottom: 30 }}>
                <li><CheckCircleFilled style={{ color: '#52c41a' }} /> Mentor không giới hạn</li>
                <li><CheckCircleFilled style={{ color: '#52c41a' }} /> Chứng nhận hoàn thành</li>
              </ul>
              <Button size="large" style={{ width: '100%', borderRadius: 8 }}>Chọn gói này</Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 4. ĐỘI NGŨ GIÁO VIÊN (Teachers) */}
      <div style={{ background: '#F9FAFB', padding: '80px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <Title level={2}>Đội ngũ giáo viên tại AESP</Title>
          <Paragraph>Giáo viên bản xứ giàu kinh nghiệm, tận tâm đồng hành</Paragraph>
          
          <Row gutter={[30, 30]} style={{ marginTop: 50 }}>
            {[1, 2, 3].map((item) => (
              <Col xs={24} md={8} key={item}>
                <Card style={{ borderRadius: 16, border: 'none' }} hoverable>
                  <Avatar size={100} src={`https://i.pravatar.cc/150?img=${item + 10}`} style={{ marginBottom: 20 }} />
                  <Title level={4} style={{ marginBottom: 5 }}>Johnson</Title>
                  <Text type="secondary">USA</Text>
                  <div style={{ marginTop: 15 }}>
                    <Tag color="blue">Business English</Tag>
                  </div>
                  <Text style={{ display: 'block', marginTop: 10, fontSize: 13 }}>10 năm kinh nghiệm</Text>
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