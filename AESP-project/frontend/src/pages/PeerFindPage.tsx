import { useEffect, useState } from 'react';
import { Button, Card, Select, Spin, message } from 'antd'; // Thêm message để báo lỗi nếu cần
import { v4 as uuidv4 } from 'uuid';
import { connect, sendMatchRequest, disconnect } from '../api/peerSocket'; // Import thêm disconnect
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function PeerFindPage() {
  const [topic, setTopic] = useState('Travel');
  const [level, setLevel] = useState('Beginner');
  // Lưu clientId vào state để không bị đổi mỗi khi render lại
  const [clientId] = useState(uuidv4()); 
  const [status, setStatus] = useState<'idle' | 'connecting' | 'searching' | 'queued'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup: Ngắt kết nối khi rời khỏi trang này
    return () => {
      disconnect();
    };
  }, []);

  const onMatchMessage = (msg: any) => {
    console.log("📩 Receive match msg:", msg);
    
    if (msg === 'queued' || msg.status === 'queued') {
      setStatus('queued');
    } else if (msg.roomId) {
      // Đã tìm thấy phòng -> Chuyển trang
      message.success('Đã tìm thấy bạn luyện tập!');
      navigate(`/peer/room/${msg.roomId}`, { state: { clientId } });
    }
  };

  const startFinding = () => {
    setStatus('connecting');

    // 👇 SỬA ĐOẠN NÀY: Dùng Callback thay vì setTimeout
    connect(
      clientId, 
      onMatchMessage, 
      () => {
        // Hàm này CHỈ chạy khi Socket đã kết nối thành công (Connected)
        console.log("✅ Socket ready, sending request...");
        sendMatchRequest({ clientId, topic, level });
        setStatus('searching');
      }
    );
  };

  return (
    <Card style={{ maxWidth: 640, margin: '20px auto', textAlign: 'center' }}>
      <h2>Tìm bạn để luyện (Peer Matching)</h2>
      
      <div style={{ marginBottom: 12, textAlign: 'left' }}>
        <label>Chủ đề: </label>
        <Select value={topic} onChange={setTopic} style={{ width: '100%' }}>
          <Option value="Travel">Du lịch</Option>
          <Option value="Business">Kinh doanh</Option>
          <Option value="Daily">Hàng ngày</Option>
          <Option value="Java">Lập trình Java</Option>
        </Select>
      </div>

      <div style={{ marginBottom: 12, textAlign: 'left' }}>
        <label>Trình độ: </label>
        <Select value={level} onChange={setLevel} style={{ width: '100%' }}>
          <Option value="Beginner">Sơ cấp</Option>
          <Option value="Intermediate">Trung cấp</Option>
          <Option value="Advanced">Cao cấp</Option>
        </Select>
      </div>

      <div style={{ marginTop: 20 }}>
        <Button 
          type="primary" 
          size="large"
          onClick={startFinding} 
          loading={status === 'connecting'} // Hiệu ứng loading trên nút
          disabled={status !== 'idle'}
        >
          {status === 'idle' ? 'Bắt đầu tìm kiếm' : 'Đang kết nối...'}
        </Button>

        <Button type="default" size="large" style={{ marginLeft: 12 }} onClick={() => navigate('/practice')}>
          Phòng luyện AI
        </Button>

        {(status === 'searching' || status === 'queued') && (
          <div style={{ marginTop: 20 }}>
            <Spin size="large" /> 
            <div style={{ marginTop: 10, color: '#1890ff' }}>
              {status === 'searching' ? 'Đang gửi yêu cầu...' : 'Đang trong hàng chờ, vui lòng đợi...'}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, fontSize: '12px', color: '#999' }}>
        ID của bạn: <code>{clientId}</code>
      </div>
    </Card>
  );
}