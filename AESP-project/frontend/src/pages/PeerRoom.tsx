/* uth.edu package */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Space, Spin, Typography, Tag, Modal, Tooltip } from "antd";
import {
  TeamOutlined,
  StopOutlined,
  MessageOutlined,
  BulbOutlined,
  RocketOutlined,
  AudioOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined
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
  { key: "DAILY", label: "Hàng ngày", desc: "Giao tiếp cơ bản về cuộc sống" },
  { key: "TRAVEL", label: "Du lịch", desc: "Hỏi đường, đặt phòng, ẩm thực" },
  { key: "BUSINESS", label: "Kinh doanh", desc: "Phỏng vấn, đàm phán, hội họp" }
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

  const startConnection = useCallback(() => {
    connectPeerSocket((msg: any) => {
      if (msg.type === "MATCHED") setRoomId(msg.roomId);
      if (msg.type === "CHAT" && msg.sender !== userId) setMessages(prev => [...prev, msg]);
      if (msg.type === "TOPIC_SUGGESTION") setSuggestion(msg.content);

      if (msg.type === "ROOM_FINISHED" || msg.type === "USER_OFFLINE") {
        Modal.warning({
          title: msg.type === "ROOM_FINISHED" ? "Phiên học kết thúc" : "Đối phương đã rời đi",
          content: "Cảm ơn bạn đã tham gia luyện tập!",
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
    disconnectPeerSocket();
  };

  const handleJoin = (t: Topic) => {
    setTopic(t);
    startConnection();
    setTimeout(() => joinRoom(userId, t.key), 400);
  };

  /* ================= 1. CHOOSE TOPIC UI ================= */
  if (!topic) {
    return (
      <div style={whitePageCenter}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/dashboard')} 
          style={backButtonStyle}
        >
          QUAY LẠI DASHBOARD
        </Button>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={rocketIconWrapper}>
            <RocketOutlined style={{ fontSize: 32, color: "#1890ff" }} />
          </div>
          <Title level={2} style={{ color: '#002766', marginTop: 16 }}>Luyện Nói Tiếng Anh</Title>
          <Text type="secondary">Kết nối và luyện tập cùng những người bạn mới</Text>
        </div>

        <div style={topicGrid}>
          {TOPICS.map(t => (
            <Card key={t.key} hoverable style={topicCard} onClick={() => handleJoin(t)}>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>{t.label}</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>{t.desc}</Text>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button type="primary" shape="round" ghost size="small">Chọn</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ================= 2. WAITING UI ================= */
  if (!roomId) {
    return (
      <div style={whitePageCenter}>
        <div style={waitingBox}>
          <Spin size="large" tip={<Text style={{ color: '#1890ff', marginTop: 16, display: 'block' }}>Đang tìm cộng sự...</Text>} />
          <div style={{ marginTop: 32 }}>
            <Tag color="blue" style={{ borderRadius: 20, padding: '4px 16px' }}>Chủ đề: {topic.label}</Tag>
          </div>
          <Button danger type="text" onClick={resetRoom} style={{ marginTop: 24, fontWeight: 500 }}>
            Hủy tìm kiếm
          </Button>
        </div>
      </div>
    );
  }

  /* ================= 3. MATCHED UI (TRẮNG - XANH CHUYÊN NGHIỆP) ================= */
  return (
    <div style={whitePageFull}>
      <div style={contentContainer}>
        
        {/* HEADER */}
        <div style={headerSection}>
          <Space size={16}>
            <div style={blueIconBox}><TeamOutlined style={{ fontSize: 22, color: "#fff" }} /></div>
            <div>
              <Title level={4} style={{ margin: 0, color: '#002766' }}>Lớp Học Trực Tuyến</Title>
              <Space split={<Divider vertical />}>
                <Text type="secondary" style={{ fontSize: 12 }}>ID: {roomId.split("-")[0].toUpperCase()}</Text>
                <Text type="success" style={{ fontSize: 12 }}>● Trạng thái: Đang kết nối</Text>
              </Space>
            </div>
          </Space>
          <div style={topicBadge}>
            <Text strong style={{ color: '#1890ff' }}>CHỦ ĐỀ: {topic.label.toUpperCase()}</Text>
          </div>
        </div>

        {/* SUGGESTION */}
        {suggestion && (
          <div style={suggestionCardBlue}>
            <Space align="start">
              <BulbOutlined style={{ fontSize: 24, color: "#faad14" }} />
              <div>
                <Text style={{ fontSize: 12, color: "#8c8c8c", textTransform: 'uppercase', letterSpacing: 1 }}>Gợi ý thảo luận</Text>
                <div style={{ fontSize: 18, color: "#002766", fontWeight: 600, marginTop: 4 }}>"{suggestion}"</div>
              </div>
            </Space>
          </div>
        )}

        {/* INTERACTION AREA */}
        <div style={mainLayoutGrid}>
          
          {/* VOICE CARD */}
          <div style={glassFrame}>
            <div style={frameHeader}>
              <AudioOutlined style={{ color: '#1890ff' }} /> 
              <Text strong style={{ color: '#002766' }}>HỘI THOẠI ÂM THANH</Text>
            </div>
            <div style={voiceVisualizer}>
               <VoiceRTC socket={getPeerSocket()} userId={userId} roomId={roomId} />
            </div>
            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Vui lòng bật Microphone và tai nghe để có chất lượng tốt nhất
              </Text>
            </div>
          </div>

          {/* CHAT CARD */}
          <div style={glassFrame}>
            <div style={frameHeader}>
              <MessageOutlined style={{ color: '#1890ff' }} /> 
              <Text strong style={{ color: '#002766' }}>TIN NHẮN VĂN BẢN</Text>
            </div>
            <div style={{ flex: 1, overflow: "hidden", padding: '0 4px' }}>
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

        {/* FOOTER ACTION */}
        <div style={footerSection}>
          <Tooltip title="Kết thúc phiên học hiện tại và quay về màn hình chính">
            <Button 
              danger 
              type="primary" 
              size="large" 
              shape="round" 
              icon={<StopOutlined />}
              style={endButtonStyle}
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận kết thúc?",
                  content: "Bạn sẽ không thể quay lại cuộc hội thoại này.",
                  okText: "Kết thúc",
                  cancelText: "Hủy",
                  onOk: () => { finishRoom(userId, roomId); resetRoom(); }
                });
              }}
            >
              KẾT THÚC BUỔI HỌC
            </Button>
          </Tooltip>
        </div>

      </div>
    </div>
  );
}

const Divider = ({ vertical }: { vertical?: boolean }) => (
  <span style={{ borderLeft: vertical ? '1px solid #d9d9d9' : 'none', margin: '0 8px', height: 12 }} />
);

/* ================= STYLES (TRẮNG - XANH HIỆN ĐẠI) ================= */

const whitePageCenter: any = {
  minHeight: "100vh", background: "#ffffff",
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
  position: 'relative'
};

const whitePageFull: any = {
  minHeight: "100vh", background: "#f0f2f5", // Nền hơi xám nhẹ để nổi bật các khung trắng
  padding: "40px 20px"
};

const backButtonStyle: any = {
  position: 'absolute', top: 40, left: 40,
  color: '#8c8c8c', fontSize: 12, letterSpacing: 1
};

const rocketIconWrapper = {
  width: 80, height: 80, background: '#e6f7ff', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
};

const topicGrid = {
  display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 24,
  maxWidth: 1000, margin: '0 auto'
};

const topicCard = {
  borderRadius: 20, textAlign: 'left' as const,
  border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
};

const waitingBox = {
  textAlign: 'center' as const, padding: 60,
  background: '#fff', borderRadius: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
};

const contentContainer: any = {
  maxWidth: 1100, margin: "0 auto",
  display: "flex", flexDirection: "column", gap: "24px"
};

const headerSection: any = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: '#fff', padding: '20px 32px', borderRadius: 24, boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
};

const blueIconBox = {
  width: 50, height: 50, background: "#1890ff", borderRadius: 14,
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: '0 6px 15px rgba(24, 144, 255, 0.3)'
};

const topicBadge = {
  background: '#e6f7ff', padding: '8px 20px', borderRadius: 12, border: '1px solid #bae7ff'
};

const suggestionCardBlue: any = {
  background: "#ffffff", padding: "24px 32px", borderRadius: "24px",
  borderLeft: "6px solid #faad14", boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
};

const mainLayoutGrid: any = {
  display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px", minHeight: "520px"
};

const glassFrame: any = {
  background: "#ffffff", borderRadius: "28px", padding: "24px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
  border: "1px solid #ffffff", display: "flex", flexDirection: "column"
};

const frameHeader: any = {
  display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px",
  paddingBottom: '12px', borderBottom: '1px solid #f5f5f5'
};

const voiceVisualizer: any = {
  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
  background: "radial-gradient(circle, #f0f7ff 0%, #ffffff 100%)",
  borderRadius: "20px", marginBottom: "20px"
};

const footerSection: any = {
  textAlign: "center", padding: "10px 0"
};

const endButtonStyle = {
  height: 54, padding: '0 40px', fontSize: 16, fontWeight: 700,
  letterSpacing: 1, boxShadow: "0 8px 20px rgba(255, 77, 79, 0.2)"
};