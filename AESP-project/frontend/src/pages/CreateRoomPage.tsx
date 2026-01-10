import { useState } from 'react';
import { Card, Button, Input, Select, Typography, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function generateId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('Travel');
  const [level, setLevel] = useState('Beginner');

  const create = () => {
    const roomId = generateId(10);
    message.success('Phòng đã tạo: ' + roomId);
    // navigate to room and pass a clientId (simple local id)
    const clientId = generateId(6);
    navigate(`/peer/room/${roomId}`, { state: { clientId, topic, level } });
  };

  return (
    <Card style={{ maxWidth: 820, margin: '20px auto' }}>
      <Title level={2} style={{ marginBottom: 8 }}>Tạo phòng luyện tiếng — AESP</Title>
      <Text type="secondary">Tạo một phòng mới, mời bạn bè vào bằng liên kết hoặc mã phòng.</Text>

      <div style={{ marginTop: 20 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <label>Chủ đề</label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} style={{ marginTop: 6 }} />
          </div>

          <div>
            <label>Trình độ</label>
            <Select value={level} onChange={(v) => setLevel(v)} style={{ width: 240, marginTop: 6 }}>
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Advanced">Advanced</Select.Option>
            </Select>
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary" size="large" onClick={create}>Tạo phòng</Button>
            <Button style={{ marginLeft: 12 }} onClick={() => { const id = generateId(6); navigator.clipboard?.writeText(id); message.info('Copied sample id: ' + id); }}>Sao chép mã mẫu</Button>
          </div>
        </Space>
      </div>
    </Card>
  );
}
