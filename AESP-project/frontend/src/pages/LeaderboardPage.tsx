// src/pages/LeaderboardPage.tsx

import React, { useEffect, useState } from 'react';
import { Table, Avatar, Tag, Card, Typography } from 'antd';
import { UserOutlined, TrophyOutlined, CrownOutlined } from '@ant-design/icons';
import gamificationApi from '../api/gamificationApi'; 
import type { LeaderboardItem } from '../types/leaderboard';

const { Title } = Typography;

const LeaderboardPage: React.FC = () => {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Gọi API khi vừa mở trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await gamificationApi.getLeaderboard();
        // Ép kiểu dữ liệu trả về (nếu cần thiết tùy vào axiosClient của bạn)
        // Nếu axiosClient trả về trực tiếp data thì dùng response
        // Nếu axiosClient trả về object { data: ... } thì dùng response.data
        setData(response as any); 
      } catch (error) {
        console.error("Lỗi tải bảng xếp hạng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cấu hình các cột cho bảng (Table Columns)
  const columns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      align: 'center' as const,
      render: (rank: number) => {
        // Xử lý tô màu cúp cho Top 3
        let icon = <span style={{ fontWeight: 'bold', fontSize: '16px' }}>#{rank}</span>;
        
        if (rank === 1) icon = <TrophyOutlined style={{ fontSize: '24px', color: '#FFD700' }} />; // Vàng
        if (rank === 2) icon = <TrophyOutlined style={{ fontSize: '24px', color: '#C0C0C0' }} />; // Bạc
        if (rank === 3) icon = <TrophyOutlined style={{ fontSize: '24px', color: '#CD7F32' }} />; // Đồng

        return <div>{icon}</div>;
      }
    },
    {
      title: 'Học viên',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text: string, record: LeaderboardItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Nếu có avatarUrl thì hiện ảnh, không thì hiện icon mặc định */}
          <Avatar 
            size="large" 
            src={record.avatarUrl} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#87d068' }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>{text || "Người dùng ẩn danh"}</div>
            {/* Nếu là Top 1 thì thêm vương miện cho ngầu */}
            {record.rank === 1 && <Tag color="gold" style={{fontSize: '10px', marginTop: '4px'}}><CrownOutlined /> Champion</Tag>}
          </div>
        </div>
      ),
    },
    {
      title: 'Danh hiệu',
      dataIndex: 'badge',
      key: 'badge',
      render: (badge: string) => {
        let color = 'default';
        // Map màu sắc theo logic Backend bạn đã chốt
        if (badge === 'Mầm non') color = 'green';     // Level 1
        if (badge === 'Học giả') color = 'geekblue';  // Level 2
        if (badge === 'Bậc thầy') color = 'purple';   // Level 3

        return <Tag color={color} style={{ fontSize: '13px', padding: '4px 10px' }}>{badge}</Tag>;
      }
    },
    {
      title: 'Tổng điểm XP',
      dataIndex: 'totalXp',
      key: 'totalXp',
      align: 'right' as const,
      render: (xp: number) => (
        <b style={{ color: '#1890ff', fontSize: '15px' }}>
          {xp ? xp.toLocaleString() : 0} XP
        </b>
      )
    },
  ];

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        {/* Tiêu đề trang */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#faad14', margin: 0 }}>
            <TrophyOutlined /> Bảng Phong Thần
          </Title>
          <p style={{ color: '#8c8c8c', marginTop: '5px' }}>
            Vinh danh những chiến binh chăm chỉ nhất tuần này
          </p>
        </div>

        {/* Bảng dữ liệu */}
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="userId" // Bắt buộc: Khóa duy nhất cho mỗi dòng
          loading={loading}
          pagination={{ pageSize: 10 }} // Mỗi trang hiện 10 người
          rowClassName={(record) => record.rank <= 3 ? 'top-rank-row' : ''} // Class để CSS thêm nếu thích
        />
      </Card>
    </div>
  );
};

export default LeaderboardPage;