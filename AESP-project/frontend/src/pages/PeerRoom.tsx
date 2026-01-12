/* uth.edu package */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Space, Spin, Typography, Tag, Modal, Divider } from "antd";
import {
  TeamOutlined,
  StopOutlined,
  MessageOutlined,
  BulbOutlined,
  RocketOutlined,
  AudioOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";

import {
  connectPeerSocket,
  joinRoom,
  getPeerSocket,
  sendChat,
  finishRoom,
  disconnectPeerSocket
} from "../services/peerSocket";

import VoiceRTC from "../components/VoiceRTC";
import ChatBox from "../components/ChatBox";

const { Title, Text } = Typography;

/* ================= DATA ================= */
const TOPICS = [
  { key: "DAILY", label: "Hàng ngày", desc: "Giao tiếp đời thường" },
  { key: "TRAVEL", label: "Du lịch", desc: "Khám phá thế giới" },
  { key: "BUSINESS", label: "Kinh doanh", desc: "Môi trường công sở" }
];

type Topic = { key: string; label: string; desc?: string };

export default function PeerRoom() {
  const navigate = useNavigate();
  const userIdRef = useRef("user_" + Math.floor(Math.random() * 100000));
  const userId = userIdRef.current;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  // State quan trọng để điều khiển vòng xoay
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  /* ================= SOCKET ================= */
  const startConnection = useCallback(() => {
    connectPeerSocket((msg: any) => {
      console.log("Socket Message Received:", msg);

      // 1. Khi khớp phòng thành công -> Tắt xoay, vào phòng
      if (msg.type === "MATCHED") {
        setIsWaitingResponse(false); 
        setRoomId(msg.roomId);
      }

      // 2. KHI ĐỐI PHƯƠNG TỪ CHỐI (Xử lý lỗi xoay vòng vòng của bạn ở đây)
      if (msg.type === "MATCH_REJECTED" || msg.type === "MATCH_FAILED" || msg.type === "CANCELLED") {
        setIsWaitingResponse(false); // Dừng xoay ngay lập tức
        setTopic(null); // Quay lại màn hình chọn chủ đề
        setRoomId(null);
        Modal.error({
          title: "Ghép đôi thất bại",
          content: msg.content || "Đối phương đã từ chối yêu cầu hoặc đã thoát.",
          centered: true
        });
      }

      if (msg.type === "CHAT" && msg.sender !== userId) setMessages(prev => [...prev, msg]);
      if (msg.type === "TOPIC_SUGGESTION") setSuggestion(msg.content);

      if (msg.type === "ROOM_FINISHED" || msg.type === "USER_OFFLINE") {
        Modal.warning({
          title: "Kết thúc",
          content: "Cuộc hội thoại đã dừng lại.",
          onOk: resetRoom,
          centered: true
        });
      }
    });
  }, [userId]);

  useEffect(() => {
    return () => disconnectPeerSocket();
  }, []);

  const resetRoom = () => {
    setRoomId(null);
    setMessages([]);
    setSuggestion(null);
    setTopic(null);
    setIsWaitingResponse(false);
    disconnectPeerSocket();
  };

  const handleJoin = (t: Topic) => {
    setTopic(t);
    setIsWaitingResponse(true); // Bắt đầu xoay vòng chờ
    startConnection();
    setTimeout(() => joinRoom(userId, t.key), 500);
  };

  /* ================= UI: CHOOSE TOPIC ================= */
  if (!topic) {
    return (
      <div style={whitePageCenter}>
        <div style={{ position: 'absolute', top: 40, left: 40 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/dashboard')} 
            style={{ fontWeight: 600, color: '#1890ff' }}
          >
            QUAY LẠI DASHBOARD
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={iconCircle}><RocketOutlined style={{ fontSize: 32, color: "#1890ff" }} /></div>
          <Title level={2} style={{ color: '#002766', marginTop: 16 }}>Luyện nói tiếng Anh</Title>
          <Text type="secondary">Chọn chủ đề để kết nối cùng bạn bè khắp nơi</Text>
        </div>

        <div style={topicGrid}>
          {TOPICS.map(t => (
            <Card key={t.key} hoverable style={topicCard} onClick={() => handleJoin(t)}>
              <Title level={4} style={{ color: '#1890ff', margin: 0 }}>{t.label}</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>{t.desc}</Text>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button type="primary" shape="round" size="small" ghost>Bắt đầu</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ================= UI: WAITING (Dừng xoay khi isWaitingResponse = false) ================= */
  if (isWaitingResponse && !roomId) {
    return (
      <div style={whitePageCenter}>
        <Card style={cardSelectionStyle}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 24, color: '#1890ff' }}>Đang tìm đối tác...</Title>
          <Text type="secondary">Vui lòng chờ đối phương xác nhận</Text>
          <div style={{ marginTop: 24 }}>
            <Button danger type="text" onClick={resetRoom}>Hủy yêu cầu</Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ================= UI: MATCHED (PHÒNG HỌC) ================= */
  return (
    <div style={whitePageFull}>
      <div style={contentContainer}>
        <div style={headerSection}>
          <Space size={16}>
            <div style={blueIconBox}><TeamOutlined style={{ fontSize: 22, color: "#fff" }} /></div>
            <div>
              <Title level={4} style={{ margin: 0, color: '#002766' }}>Lớp học trực tuyến</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Mã phòng: {roomId.split("-")[0].toUpperCase()}</Text>
            </div>
          </Space>
          <Tag color="blue" style={{ borderRadius: 10, padding: "5px 15px", fontWeight: 'bold' }}>
            CHỦ ĐỀ: {topic.label.toUpperCase()}
          </Tag>
        </div>

        {suggestion && (
          <div style={suggestionCardBlue}>
            <BulbOutlined style={{ fontSize: 24, color: "#faad14", marginRight: 16 }} />
            <div>
              <Text style={{ fontSize: 11, color: "#8c8c8c", textTransform: 'uppercase' }}>Gợi ý thảo luận</Text>
              <div style={{ fontSize: 18, color: "#002766", fontWeight: 600 }}>"{suggestion}"</div>
            </div>
          </div>
        )}

        <div style={mainGrid}>
          <div style={glassFrame}>
            <div style={frameHeader}>
              <AudioOutlined style={{ color: '#1890ff' }} /> <Text strong>ÂM THANH LIVE</Text>
            </div>
            <div style={voiceStageArea}>
               <VoiceRTC socket={getPeerSocket()} userId={userId} roomId={roomId} />
            </div>
          </div>

          <div style={glassFrame}>
            <div style={frameHeader}>
              <MessageOutlined style={{ color: '#1890ff' }} /> <Text strong>TIN NHẮN</Text>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <ChatBox
                messages={messages}
                currentUser={userId}
                onSend={(content) => {
                  setMessages(prev => [...prev, { sender: userId, content }]);
                  sendChat(userId, roomId, content);
                }}
              />
            </div>
          </div>
        </div>

        <div style={actionFooter}>
          <Button 
            danger 
            type="primary" 
            size="large" 
            shape="round" 
            icon={<StopOutlined />}
            style={endButtonStyle}
            onClick={() => {
              Modal.confirm({
                title: "Kết thúc buổi luyện nói?",
                onOk: () => { finishRoom(userId, roomId); resetRoom(); }
              });
            }}
          >
            KẾT THÚC PHIÊN HỌC
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const whitePageCenter: any = {
  minHeight: "100vh", background: "#ffffff", display: "flex", 
  flexDirection: "column", justifyContent: "center", alignItems: "center", position: 'relative'
};
const whitePageFull: any = { minHeight: "100vh", background: "#f8f9fa", padding: "30px 20px" };
const iconCircle = { width: 70, height: 70, background: '#e6f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const topicGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 260px)', gap: 20, maxWidth: 900 };
const topicCard = { borderRadius: 20, border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' };
const cardSelectionStyle = { width: 400, textAlign: "center" as const, borderRadius: 24, border: 'none', boxShadow: "0 10px 40px rgba(0,0,0,0.05)" };
const contentContainer: any = { maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" };
const headerSection: any = { display: "flex", justifyContent: "space-between", alignItems: "center", background: '#fff', padding: '16px 24px', borderRadius: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' };
const blueIconBox = { width: 46, height: 46, background: "#1890ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" };
const suggestionCardBlue: any = { background: "#ffffff", padding: "20px 24px", borderRadius: "20px", borderLeft: "5px solid #faad14", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: 'flex', alignItems: 'center' };
const mainGrid: any = { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px", minHeight: "500px" };
const glassFrame: any = { background: "#ffffff", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0", display: "flex", flexDirection: "column" };
const frameHeader: any = { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "#8c8c8c" };
const voiceStageArea: any = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f5ff", borderRadius: "16px", marginBottom: "16px" };
const actionFooter: any = { textAlign: "center", padding: "20px 0", borderTop: "1px solid #eee", marginTop: "10px" };
const endButtonStyle = { width: 220, height: 50, fontWeight: "bold" };