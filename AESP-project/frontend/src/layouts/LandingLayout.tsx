import React from 'react';
import { Layout, Button, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RocketFilled } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  // Menu items
  const menuItems = [
    { key: 'teachers', label: 'Giáo viên tiêu biểu' },
    { key: 'pricing', label: 'Bảng giá' },
    { key: 'features', label: 'Tính năng' },
  ];

  return (
    <Layout className="layout" style={{ background: '#fff' }}>
      {/* HEADER */}
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 50px',
        boxShadow: '0 2px 8px #f0f1f2',
        height: '80px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        {/* LOGO */}
        <div
          style={{ fontSize: '24px', fontWeight: '900', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => navigate('/')}
        >
          <div style={{ background: '#5932EA', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '20px' }}>
            AESP
          </div>
        </div>

        {/* MENU GIỮA */}
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{ flex: 1, justifyContent: 'center', borderBottom: 'none', fontSize: '16px', fontWeight: 500 }}
        />

        {/* NÚT BẤM */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <Button type="text" style={{ fontSize: '16px', fontWeight: 600 }} onClick={() => navigate('/login')}>
            Đăng nhập
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: '#2B4DFF', borderRadius: '6px', fontWeight: 'bold' }}
            onClick={() => navigate('/register')}
          >
            Học thử miễn phí
          </Button>
        </div>
      </Header>

      {/* BODY */}
      <Content style={{ minHeight: '100vh', background: '#fff' }}>
        {children}
      </Content>

      {/* FOOTER */}
      <Footer style={{ background: '#f8f9fa', padding: '60px 50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 300 }}>
            <h3 style={{ fontWeight: 'bold' }}>AESP</h3>
            <p>Nền tảng học tiếng Anh AI hàng đầu Việt Nam.</p>
          </div>
          <div>
            <h4>Sản phẩm</h4>
            <p>Tính năng</p>
            <p>Bảng giá</p>
          </div>
          <div>
            <h4>Công ty</h4>
            <p>Về chúng tôi</p>
            <p>Blog</p>
          </div>
          <div>
            <h4>Hỗ trợ</h4>
            <p>Trung tâm trợ giúp</p>
            <p>Liên hệ</p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingLayout;