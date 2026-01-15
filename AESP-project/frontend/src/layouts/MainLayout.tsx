import React, { useEffect, useState } from 'react';
import { Layout, Avatar, Dropdown, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Đã đăng xuất!');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#001529',
          padding: '0 20px'
        }}
      >
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Study-S Admin
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'white' }}>
            Xin chào, <strong>{user?.fullName}</strong> ({user?.role})
          </span>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </div>
      </Header>

      <Content style={{ padding: 24 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380, borderRadius: 8 }}>
          {children}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        AESP Project ©2025 Created by You
      </Footer>
    </Layout>
  );
};

export default MainLayout;