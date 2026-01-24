import React, { useState } from 'react';
import { Button, Row, Col, Card, Typography, Avatar, Tag, Space } from 'antd';
import { CheckCircleFilled, AudioOutlined, RobotOutlined, UsergroupAddOutlined, StarFilled, PlayCircleFilled, ThunderboltFilled, GlobalOutlined, AimOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom'; // Không cần dùng navigate nữa
import logoImg from '../assets/images/logo.png';
import localImage from '../assets/images/image.png';
import AuthModal from '../components/AuthModal'; // Đảm bảo đường dẫn đúng

const { Title, Paragraph, Text } = Typography;

// --- CSS CONFIG ---
const primaryGradient = 'linear-gradient(135deg, #2B4DFF 0%, #8752f3 100%)';
const secondaryGradient = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
const softShadow = '0 20px 40px rgba(43, 77, 255, 0.08)';
const hoverShadow = '0 30px 60px rgba(43, 77, 255, 0.15)';

// --- INTERFACE CHO LAYOUT ---
// Thêm props để nhận hàm mở modal từ cha
interface LandingLayoutProps {
  children: React.ReactNode;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

// --- COMPONENT LAYOUT ---
const LandingLayout: React.FC<LandingLayoutProps> = ({ children, onOpenLogin, onOpenRegister }) => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px 40px', 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(20px)', 
        position: 'fixed', 
        top : 0, 
        left : 0, 
        right : 0, 
        zIndex: 1000, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        height: '80px' 
      }}>
        {/* LOGO SECTION */}
        <div style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
            <img src={logoImg} alt="AESP Logo" style={{ height: 45, width: 'auto', marginRight: 12 }} /> 
            <Title level={3} style={{ 
                margin: 0, 
                background: 'linear-gradient(135deg, #2B4DFF 0%, #8752f3 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                fontWeight: 800, 
                fontSize: '28px' 
            }}>
                AESP
            </Title>
        </div>

        {/* MENU CENTER */}
        <Space size={40} className="hidden-mobile"> 
            <Button type="text" style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Giáo viên tiêu biểu</Button>
            <Button type="text" style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Bảng giá</Button>
            <Button type="text" style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Tính năng</Button>
        </Space>

        {/* ACTION RIGHT - ĐÃ SỬA: GỌI HÀM TỪ PROPS */}
        <Space size={20} style={{ minWidth: '200px', justifyContent: 'flex-end' }}>
            {/* Nút Đăng nhập */}
            <Button 
                type="text" 
                style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}
                onClick={onOpenLogin} 
            >
                Đăng nhập
            </Button>
            
            {/* Nút Đăng ký (Học thử) */}
            <Button type="primary" 
                onClick={onOpenRegister}
                style={{ 
                    background: 'linear-gradient(135deg, #2B4DFF 0%, #8752f3 100%)', 
                    border: 'none', 
                    borderRadius: '24px', 
                    height: '48px', 
                    padding: '0 30px', 
                    fontSize: '16px', 
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(43, 77, 255, 0.3)' 
            }}>
                Học thử miễn phí
            </Button>
        </Space>
      </header>

      <div style={{ paddingTop: 80 }}>
          {children}
      </div>

      {/* Footer (Giữ nguyên) */}
      <footer style={{ background: '#0F172A', color: 'white', padding: '80px 20px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Row gutter={[40, 40]}>
                  <Col xs={24} md={9}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                          <img src={logoImg} alt="AESP" style={{ height: 40, width: 'auto', marginRight: 12 }} />
                          <Title level={3} style={{ margin: 0, color: 'white', fontWeight: 800, letterSpacing: 1 }}>AESP</Title>
                      </div>
                      <Text style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.8, display: 'block', marginBottom: 30, maxWidth: '300px' }}>
                          Nền tảng học tiếng Anh AI hàng đầu Việt Nam. Giúp bạn tự tin giao tiếp chỉ sau 3 tháng.
                      </Text>
                  </Col>
                  <Col xs={24} md={5}>
                      <Title level={5} style={{ color: 'white', marginBottom: 24, fontSize: '18px' }}>Sản phẩm</Title>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Tính năng nổi bật</Text>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Bảng giá</Text>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Dành cho doanh nghiệp</Text>
                      </div>
                  </Col>
                  <Col xs={24} md={5}>
                      <Title level={5} style={{ color: 'white', marginBottom: 24, fontSize: '18px' }}>Công ty</Title>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Về chúng tôi</Text>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Đội ngũ giáo viên</Text>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Liên hệ</Text>
                      </div>
                  </Col>
                  <Col xs={24} md={5}>
                      <Title level={5} style={{ color: 'white', marginBottom: 24, fontSize: '18px' }}>Hỗ trợ</Title>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Trung tâm trợ giúp</Text>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Điều khoản sử dụng</Text>
                          <Text style={{ color: '#94A3B8', cursor: 'pointer' }}>Chính sách bảo mật</Text>
                      </div>
                  </Col>
              </Row>
              <div style={{ borderTop: '1px solid #334155', marginTop: 60, paddingTop: 30, textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <Text style={{ color: '#64748B' }}>© 2024 AESP. All rights reserved.</Text>
                  <div style={{ display: 'flex', gap: 20 }}>
                      <Text style={{ color: '#64748B', cursor: 'pointer' }}>Privacy Policy</Text>
                      <Text style={{ color: '#64748B', cursor: 'pointer' }}>Terms of Service</Text>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

// --- LANDING PAGE MAIN COMPONENT ---
const LandingPage: React.FC = () => {
  // const navigate = useNavigate(); // Đã comment vì dùng Modal

  // 1. STATE QUẢN LÝ MODAL (Thêm mới)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"LOGIN" | "REGISTER">("LOGIN");

  // 2. CÁC HÀM MỞ MODAL
  const openLogin = () => {
    setAuthView("LOGIN");
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthView("REGISTER");
    setIsAuthModalOpen(true);
  };

  // CSS Animation keyframes
  const styles = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    .hover-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .hover-card:hover { transform: translateY(-10px); box-shadow: ${hoverShadow} !important; }
    .blob-bg {
      position: absolute;
      filter: blur(100px);
      z-index: 0;
      opacity: 0.5;
    }
    .feature-icon-box {
        width: 80px;
        height: 80px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        font-size: 36px;
        transition: all 0.3s ease;
    }
    .hover-card:hover .feature-icon-box {
        transform: scale(1.1) rotate(5deg);
    }
  `;

  return (
    // Truyền callback xuống Layout để nút Header hoạt động
    <LandingLayout onOpenLogin={openLogin} onOpenRegister={openRegister}>
      <style>{styles}</style>
      
      {/* 3. CHÈN AUTH MODAL TẠI ĐÂY */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authView}
      />
      
      {/* 1. HERO SECTION */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '120px 20px 100px', background: '#F8FAFC' }}>
        <div className="blob-bg" style={{ top: -150, left: -150, width: 500, height: 500, background: '#e0e7ff', borderRadius: '50%' }} />
        <div className="blob-bg" style={{ bottom: -100, right: -100, width: 400, height: 400, background: '#f3e8ff', borderRadius: '50%' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Row gutter={[60, 40]} align="middle">
            <Col xs={24} md={12}>
              <Tag color="blue" style={{ padding: '8px 16px', borderRadius: '30px', marginBottom: 24, fontSize: 14, fontWeight: 600, border: 'none', background: '#E0E7FF', color: '#2B4DFF' }}>
                  🚀 Công nghệ AI Tiên Tiến Nhất
              </Tag>
              
              <Title level={1} style={{ fontSize: 'clamp(48px, 5vw, 72px)', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, marginBottom: 24 }}>
                Nói Tiếng Anh <br/>
                <span style={{ background: primaryGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tự Tin & Chuẩn Xác</span>
              </Title>
              
              <Paragraph style={{ fontSize: '20px', color: '#64748B', lineHeight: 1.6, marginBottom: 40, maxWidth: 550 }}>
                Luyện tập 24/7 với trợ lý AI và đội ngũ Mentor bản xứ. Phản hồi tức thì, lộ trình cá nhân hóa giúp bạn tiến bộ vượt bậc.
              </Paragraph>
              
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  style={{ height: '64px', padding: '0 48px', fontSize: '18px', fontWeight: 700, background: primaryGradient, border: 'none', borderRadius: '16px', boxShadow: '0 15px 30px rgba(43, 77, 255, 0.3)' }} 
                  onClick={openRegister} // SỬA: Mở Modal Register
                >
                  Kiểm tra trình độ ngay
                </Button>
              </div>
            </Col>
            
            <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center', perspective: '1000px' }}>
              <div style={{ position: 'relative', animation: 'float 6s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.4)', borderRadius: 50, backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: softShadow }}>
                  <img alt="Học tiếng Anh trên điện thoại" src={localImage} style={{ width: '100%', maxWidth: 550, borderRadius: '40px', transform: 'translateZ(20px)' }} />
                </div>
                <Card 
                  style={{ position: 'absolute', top: 60, left: -50, width: 200, borderRadius: 20, boxShadow: hoverShadow, border: 'none', transform: 'translateZ(50px)' }}
                  styles={{ body: { padding: 20, display: 'flex', alignItems: 'center', gap: 15 } }}
                >
                  <div style={{ width: 48, height: 48, background: '#E6FFFA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircleFilled style={{ color: '#38B2AC', fontSize: 24 }} />
                  </div>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: 16 }}>Phát âm chuẩn</Text>
                    <Text type="success" style={{ fontSize: 14, fontWeight: 600 }}>AI chấm 98%</Text>
                  </div>
                </Card>
                <div style={{ position: 'absolute', bottom: 80, right: -40, background: 'white', padding: '20px', borderRadius: 24, boxShadow: hoverShadow, transform: 'translateZ(40px)', display: 'flex', alignItems: 'center', gap: 15 }}>
                      <div style={{ width: 50, height: 50, borderRadius: '50%', background: secondaryGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <ThunderboltFilled style={{ color: 'white', fontSize: 24 }} />
                      </div>
                    <div>
                        <Text strong style={{ fontSize: 18, display: 'block' }}>Học mọi lúc</Text>
                        <Text type="secondary">Linh hoạt 24/7</Text>
                    </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 2. TÍNH NĂNG */}
      <div style={{ background: '#fff', padding: '120px 20px', position: 'relative' }}>
        <div className="blob-bg" style={{ top: '50%', left: '50%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(43,77,255,0.05) 0%, rgba(255,255,255,0) 70%)', transform: 'translate(-50%, -50%)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <Text style={{ color: '#2B4DFF', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Tính năng vượt trội</Text>
            <Title level={2} style={{ marginTop: 15, fontSize: 42, fontWeight: 800 }}>Kết hợp hoàn hảo AI & Mentor</Title>
            <Paragraph style={{ fontSize: 18, color: '#64748B', maxWidth: 700, margin: '20px auto 0' }}>
                Trải nghiệm học tập được cá nhân hóa tối đa, giúp bạn bứt phá kỹ năng giao tiếp nhanh chóng.
            </Paragraph>
          </div>

          <Row gutter={[40, 40]}>
            {[
              { 
                icon: <AudioOutlined />, 
                color: '#2B4DFF', 
                bg: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                title: 'AI Grader - Chấm điểm chuẩn xác', 
                desc: 'Công nghệ phân tích âm thanh tiên tiến nhận diện lỗi sai đến từng âm tiết, ngữ điệu. Gợi ý cách sửa cụ thể ngay lập tức.' 
              },
              { 
                icon: <RobotOutlined />, 
                color: '#8B5CF6', 
                bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                title: 'Real-time Practice - Hội thoại 24/7', 
                desc: 'Luyện tập giao tiếp phản xạ không giới hạn với trợ lý AI. Đa dạng chủ đề và tình huống thực tế, không còn ngại ngùng.' 
              },
              { 
                icon: <UsergroupAddOutlined />, 
                color: '#EC4899', 
                bg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
                title: 'Mentor 1-1 - Đồng hành chuyên sâu', 
                desc: 'Kết nối trực tiếp với giáo viên bản xứ giàu kinh nghiệm. Nhận phản hồi sâu sắc và lộ trình học được "may đo" riêng cho bạn.' 
              }
            ].map((feature, idx) => (
              <Col xs={24} md={8} key={idx}>
                <Card 
                  className="hover-card" 
                  variant="borderless"
                  style={{ borderRadius: 30, height: '100%', boxShadow: softShadow, border: '1px solid #F1F5F9', overflow: 'hidden' }} 
                  styles={{ body: { padding: 40, position: 'relative', zIndex: 1 } }}
                >
                  <div className="feature-icon-box" style={{ background: feature.bg, color: feature.color, boxShadow: `0 10px 20px ${feature.color}30` }}>
                    {feature.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 20, fontSize: 22 }}>{feature.title}</Title>
                  <Paragraph style={{ color: '#64748B', lineHeight: 1.7, fontSize: 16 }}>{feature.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 3. BẢNG GIÁ */}
      <div style={{ padding: '120px 20px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <Title level={2} style={{ fontSize: 42, fontWeight: 800 }}>Bảng giá linh hoạt</Title>
            <Paragraph style={{ fontSize: 18, color: '#64748B' }}>Chọn gói phù hợp nhất với mục tiêu và ngân sách của bạn</Paragraph>
          </div>

          <Row gutter={[30, 30]} align="bottom">
            {/* Gói Cơ bản */}
            <Col xs={24} md={8}>
              <Card className="hover-card" variant="borderless" style={{ borderRadius: 30, padding: 30, border: '1px solid #E2E8F0', background: 'white' }}>
                <Title level={4} style={{ color: '#64748B', marginBottom: 30 }}>Cơ bản</Title>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 30 }}>
                  <Title level={1} style={{ margin: 0, fontWeight: 800 }}>200K</Title>
                  <Text type="secondary" style={{ fontSize: 18, fontWeight: 500 }}>/tháng</Text>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0' }}>
                  {['AI Practice không giới hạn', 'Chấm điểm phát âm chuẩn xác'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 18, color: '#475569', fontSize: 16, alignItems: 'center' }}>
                      <CheckCircleFilled style={{ color: '#2B4DFF', fontSize: 18 }} /> {item}
                    </li>
                  ))}
                </ul>
                {/* SỬA: Mở Modal Register */}
                <Button onClick={openRegister} size="large" block style={{ borderRadius: 16, height: 56, fontSize: 18, fontWeight: 600, border: '2px solid #E2E8F0', color: '#475569' }}>Chọn gói này</Button>
              </Card>
            </Col>

            {/* Gói Chuyên nghiệp */}
            <Col xs={24} md={8}>
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: secondaryGradient, padding: '8px 20px', borderRadius: 30, fontSize: 14, fontWeight: 800, color: '#0F172A', zIndex: 2, boxShadow: '0 5px 15px rgba(255, 165, 0, 0.4)' }}>
                  PHỔ BIẾN NHẤT
                </div>
                <Card 
                  variant="borderless"
                  style={{ borderRadius: 30, padding: 40, background: '#0F172A', color: 'white', transform: 'scale(1.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', position: 'relative' }}
                >
                  <Title level={4} style={{ color: '#94A3B8', marginBottom: 30 }}>Chuyên nghiệp</Title>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 30 }}>
                    <Title level={1} style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 48 }}>550K</Title>
                    <Text style={{ color: '#94A3B8', fontSize: 18, fontWeight: 500 }}>/tháng</Text>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0' }}>
                    {['Tất cả tính năng gói Cơ bản', '2 buổi Mentor 1-1/tháng', 'Lộ trình học cá nhân hóa', 'Báo cáo tiến độ chi tiết tuần'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 18, color: 'white', fontSize: 16, alignItems: 'center' }}>
                        <CheckCircleFilled style={{ color: '#2B4DFF', fontSize: 18 }} /> {item}
                      </li>
                    ))}
                  </ul>
                  {/* SỬA: Mở Modal Register */}
                  <Button onClick={openRegister} type="primary" size="large" block style={{ borderRadius: 16, height: 56, fontSize: 18, fontWeight: 700, background: primaryGradient, border: 'none', boxShadow: '0 10px 25px rgba(43, 77, 255, 0.4)' }}>Bắt đầu ngay</Button>
                </Card>
              </div>
            </Col>

            {/* Gói Cao cấp */}
            <Col xs={24} md={8}>
              <Card className="hover-card" variant="borderless" style={{ borderRadius: 30, padding: 30, border: '1px solid #E2E8F0', background: 'white' }}>
                <Title level={4} style={{ color: '#64748B', marginBottom: 30 }}>Cao cấp</Title>
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 30 }}>
                  <Title level={1} style={{ margin: 0, fontWeight: 800 }}>999K</Title>
                  <Text type="secondary" style={{ fontSize: 18, fontWeight: 500 }}>/tháng</Text>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0' }}>
                  {['Mentor 1-1 không giới hạn', 'Chứng nhận hoàn thành khóa học', 'Hỗ trợ ưu tiên 24/7'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 18, color: '#475569', fontSize: 16, alignItems: 'center' }}>
                      <CheckCircleFilled style={{ color: '#2B4DFF', fontSize: 18 }} /> {item}
                    </li>
                  ))}
                </ul>
                <Button size="large" block style={{ borderRadius: 16, height: 56, fontSize: 18, fontWeight: 600, border: '2px solid #E2E8F0', color: '#475569' }}>Liên hệ tư vấn</Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* 4. ĐỘI NGŨ GIÁO VIÊN */}
      <div style={{ background: '#fff', padding: '120px 20px', position: 'relative', overflow: 'hidden' }}>
        <div className="blob-bg" style={{ top: '10%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(255,255,255,0) 70%)' }} />
        
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Title level={2} style={{ fontSize: 42, fontWeight: 800, marginBottom: 15 }}>Đội ngũ giáo viên tại AESP</Title>
          <Paragraph style={{ color: '#64748B', fontSize: 18, marginBottom: 70 }}>Các chuyên gia bản xứ giàu kinh nghiệm, tận tâm đồng hành cùng bạn</Paragraph>
          
          <Row gutter={[40, 40]}>
            {[
              { name: 'Johnson', country: 'USA', role: 'Business English', exp: '10 năm', img: '12', tags: ['Giao tiếp', 'Thương mại'] },
              { name: 'Emily', country: 'UK', role: 'IELTS Expert', exp: '8 năm', img: '25', tags: ['IELTS', 'Phát âm'] },
              { name: 'David', country: 'Australia', role: 'Communication', exp: '12 năm', img: '33', tags: ['Phản xạ', 'Tự tin'] }
            ].map((teacher, idx) => (
              <Col xs={24} md={8} key={idx}>
                <Card 
                  className="hover-card" 
                  variant="borderless" 
                  style={{ borderRadius: 30, overflow: 'hidden', boxShadow: softShadow, border: '1px solid #F1F5F9' }}
                  styles={{ body: { padding: 0 } }}
                >
                  <div style={{ height: 120, background: `linear-gradient(135deg, ${idx === 0 ? '#2B4DFF' : idx === 1 ? '#8B5CF6' : '#EC4899'} 0%, rgba(255,255,255,0) 100%)`, opacity: 0.8 }}></div>
                  <div style={{ marginTop: -60, textAlign: 'center', padding: '0 20px' }}>
                    <Avatar size={120} src={`https://i.pravatar.cc/200?img=${teacher.img}`} style={{ border: '6px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  </div>
                  <div style={{ padding: '20px 30px 40px', textAlign: 'center' }}>
                    <Title level={4} style={{ margin: '15px 0 5px', fontSize: 24 }}>{teacher.name}</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 15, fontSize: 16, fontWeight: 500 }}>{teacher.country}</Text>
                    <Tag color="blue" style={{ padding: '5px 15px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', background: '#E0E7FF', color: '#2B4DFF', marginBottom: 15 }}>
                        {teacher.role}
                    </Tag>
                    <Text style={{ display: 'block', fontSize: 15, color: '#64748B', marginBottom: 20 }}>{teacher.exp} kinh nghiệm</Text>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                        {teacher.tags.map(tag => <Tag key={tag} style={{ borderRadius: 20, background: '#F1F5F9', border: 'none', color: '#64748B' }}>{tag}</Tag>)}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

       {/* 5. VỀ CHÚNG TÔI */}
       <div style={{ padding: '120px 20px', background: '#F8FAFC', textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Title level={2} style={{ fontSize: 42, fontWeight: 800, marginBottom: 15 }}>Về chúng tôi</Title>
            <Paragraph style={{ color: '#64748B', fontSize: 18, marginBottom: 70, maxWidth: 700, margin: '0 auto 70px' }}>Sứ mệnh giúp người Việt Nam tự tin giao tiếp tiếng Anh, mở ra cơ hội toàn cầu.</Paragraph>

            <Row gutter={[60, 40]} justify="center">
                <Col xs={24} md={10}>
                    <div style={{ padding: 40, background: 'white', borderRadius: 30, boxShadow: softShadow, height: '100%', border: '1px solid #E2E8F0' }}>
                        <div style={{ width: 70, height: 70, background: '#E0E7FF', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                            <GlobalOutlined style={{ fontSize: 36, color: '#2B4DFF' }} />
                        </div>
                        <Title level={3} style={{ marginBottom: 20 }}>Tầm nhìn</Title>
                        <Paragraph style={{ color: '#64748B', fontSize: 16, lineHeight: 1.7 }}>
                            Trở thành nền tảng học tiếng Anh hàng đầu Việt Nam, kết hợp công nghệ AI tiên tiến và con người để mang lại trải nghiệm học tập đột phá, hiệu quả nhất.
                        </Paragraph>
                    </div>
                </Col>
                <Col xs={24} md={10}>
                      <div style={{ padding: 40, background: 'white', borderRadius: 30, boxShadow: softShadow, height: '100%', border: '1px solid #E2E8F0' }}>
                        <div style={{ width: 70, height: 70, background: '#F5F3FF', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                            <AimOutlined style={{ fontSize: 36, color: '#8B5CF6' }} />
                        </div>
                        <Title level={3} style={{ marginBottom: 20 }}>Sứ mệnh</Title>
                        <Paragraph style={{ color: '#64748B', fontSize: 16, lineHeight: 1.7 }}>
                            Giúp mọi người tự tin giao tiếp tiếng Anh trong mọi tình huống, từ đời sống hàng ngày đến môi trường chuyên nghiệp quốc tế.
                        </Paragraph>
                    </div>
                </Col>
            </Row>
        </div>
       </div>
      
      {/* 6. CTA BOTTOM */}
      <div style={{ padding: '100px 20px', background: '#fff' }}>
         <div style={{ 
           maxWidth: 1200, 
           margin: '0 auto', 
           background: '#0F172A', 
           borderRadius: 40, 
           padding: '80px 30px', 
           textAlign: 'center',
           position: 'relative',
           overflow: 'hidden',
           boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
         }}>
            <div className="blob-bg" style={{ top: '0%', left: '0%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(43,77,255,0.3) 0%, rgba(255,255,255,0) 70%)', opacity: 1 }} />
            <div className="blob-bg" style={{ bottom: '0%', right: '0%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(255,255,255,0) 70%)', opacity: 1 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Title level={2} style={{ color: 'white', marginBottom: 25, fontSize: 48, fontWeight: 900 }}>Sẵn sàng chinh phục tiếng Anh?</Title>
              <Paragraph style={{ color: '#CBD5E1', fontSize: 20, marginBottom: 50, maxWidth: 700, margin: '0 auto 50px' }}>Tham gia ngay hôm nay để trải nghiệm phương pháp học tập hiện đại và hiệu quả nhất.</Paragraph>
              {/* SỬA: Mở Modal Register */}
              <Button type="primary" size="large" style={{ height: 64, padding: '0 56px', borderRadius: 20, fontSize: 20, fontWeight: 700, background: primaryGradient, border: 'none', boxShadow: '0 15px 30px rgba(43, 77, 255, 0.4)' }} onClick={openRegister}>
                Đăng ký học thử miễn phí
              </Button>
              <Text style={{ display: 'block', marginTop: 20, color: '#94A3B8' }}>Không cần thẻ tín dụng. Hủy bất kỳ lúc nào.</Text>
            </div>
         </div>
      </div>

    </LandingLayout>
  );
};

export default LandingPage;