import React, { useEffect, useState } from 'react';
import { Layout, Avatar, Dropdown, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

// Định nghĩa kiểu dữ liệu cho props (nội dung bên trong)
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Lấy thông tin user từ LocalStorage khi mới vào trang
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      // Nếu chưa đăng nhập mà cố vào -> Đá về trang Login
      navigate('/login');
    }
  }, [navigate]);

  // Hàm Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    localStorage.removeItem('user');  // Xóa thông tin user
    message.success('Đã đăng xuất!');
    navigate('/login'); // Quay về trang đăng nhập
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529', padding: '0 20px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Study-S Admin
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'white' }}>Xin chào, <strong>{user?.fullName}</strong> ({user?.role})</span>
          <Dropdown menu={{ items: [{ key: '1', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout }] }} placement="bottomRight">
            <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 380, borderRadius: '8px' }}>
          {children} {/* Nội dung của từng trang sẽ hiện ở đây */}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        AESP Project ©2025 Created by You
      </Footer>
    </Layout>
  );
};

export default MainLayout;