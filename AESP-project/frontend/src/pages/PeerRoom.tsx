/* uth.edu package */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Space, Spin, Typography, Tag, Modal } from "antd";
import {
  TeamOutlined, StopOutlined, MessageOutlined, BulbOutlined,
  RocketOutlined, AudioOutlined, ArrowLeftOutlined
} from "@ant-design/icons";

import {
  connectPeerSocket, joinRoom, getPeerSocket,
  sendChat, finishRoom, disconnectPeerSocket
} from "../services/peerSocket";

import VoiceRTC from "../components/VoiceRTC";
import ChatBox from "../components/ChatBox";

const { Title, Text } = Typography;

const TOPICS = [
  { key: "DAILY", label: "Hàng ngày", desc: "Giao tiếp đời thường" },
  { key: "TRAVEL", label: "Du lịch", desc: "Khám phá thế giới" },
  { key: "BUSINESS", label: "Kinh doanh", desc: "Môi trường công sở" }
];

type Topic = { key: string; label: string; desc?: string };

export default function PeerRoom() {
  const navigate = useNavigate();
  
  // Lấy dữ liệu và đảm bảo không bị chuỗi 'undefined'
  const [userId, setUserId] = useState<string>(() => {
    const id = localStorage.getItem("userId");
    return (id && id !== "undefined") ? id : "user_" + Math.random().toString(36).substr(2, 9);
  });
  const [fullName, setFullName] = useState<string>(localStorage.getItem("fullName") || "Học viên");

  const [topic, setTopic] = useState<Topic | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const startConnection = useCallback(() => {
    connectPeerSocket((msg: any) => {
      console.log("Socket Message Received:", msg);

      if (msg.type === "MATCHED") {
        setIsWaitingResponse(false); 
        setRoomId(msg.roomId);
      }

      // FIX QUAN TRỌNG: Ép kiểu String và xử lý trường hợp sender là 'undefined' từ server
      if (msg.type === "CHAT") {
        const isMine = String(msg.sender) === String(userId);
        if (!isMine) {
          // Chỉ thêm vào state nếu không phải tin nhắn của chính mình (vì mình đã thêm local rồi)
          setMessages(prev => [...prev, msg]);
        }
      }
      
      if (msg.type === "TOPIC_SUGGESTION") {
        setSuggestion(msg.content);
      }

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
    setIsWaitingResponse(true);
    startConnection();
    setTimeout(() => joinRoom(userId, t.key, fullName), 500);
  };

  // UI CHỌN CHỦ ĐỀ
  if (!topic) {
    return (
      <div style={whitePageCenter}>
        <div style={{ position: 'absolute', top: 40, left: 40 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard')} type="text" style={{fontWeight: 600, color: '#1890ff'}}>QUAY LẠI</Button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={iconCircle}><RocketOutlined style={{ fontSize: 32, color: "#1890ff" }} /></div>
          <Title level={2}>Chào {fullName}</Title>
          <Text type="secondary">Chọn chủ đề để luyện nói</Text>
        </div>
        <div style={topicGrid}>
          {TOPICS.map(t => (
            <Card key={t.key} hoverable onClick={() => handleJoin(t)} style={topicCard}>
              <Title level={4} style={{ color: '#1890ff' }}>{t.label}</Title>
              <Text>{t.desc}</Text>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button type="primary" shape="round" size="small" ghost>Bắt đầu</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // UI CHỜ GHÉP
  if (isWaitingResponse && !roomId) {
    return (
      <div style={whitePageCenter}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: 20 }}>Đang tìm đối tác...</Title>
        <Button danger onClick={resetRoom} type="link">Hủy</Button>
      </div>
    );
  }

  // UI PHÒNG CHAT
  return (
    <div style={whitePageFull}>
      <div style={contentContainer}>
        <div style={headerSection}>
          <Title level={4} style={{ margin: 0 }}>Lớp học trực tuyến</Title>
          <Tag color="blue">CHỦ ĐỀ: {topic.label}</Tag>
        </div>

        {suggestion && (
          <div style={suggestionCardBlue}>
            <BulbOutlined style={{ fontSize: 24, color: "#faad14", marginRight: 16 }} />
            <div>
              <Text strong>GỢI Ý THẢO LUẬN</Text>
              <div style={{ fontSize: 18 }}>"{suggestion}"</div>
            </div>
          </div>
        )}

        <div style={mainGrid}>
          <div style={glassFrame}>
            <div style={frameHeader}><AudioOutlined /> ÂM THANH LIVE</div>
            <div style={voiceStageArea}>
               {roomId && <VoiceRTC socket={getPeerSocket()} userId={userId} roomId={roomId} />}
            </div>
          </div>

          <div style={glassFrame}>
            <div style={frameHeader}><MessageOutlined /> TIN NHẮN</div>
            <ChatBox
              messages={messages}
              currentUser={userId}
              onSend={(content) => {
                const myMsg = { sender: userId, senderName: "Bạn", content };
                setMessages(prev => [...prev, myMsg]);
                sendChat(userId, roomId || "", content, fullName);
              }}
            />
          </div>
        </div>

        <div style={actionFooter}>
          <Button danger type="primary" shape="round" onClick={() => {
            if(roomId) finishRoom(userId, roomId);
            resetRoom();
          }}>KẾT THÚC PHIÊN HỌC</Button>
        </div>
      </div>
    </div>
  );
}

// Styles
const whitePageCenter: any = { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };
const whitePageFull: any = { minHeight: "100vh", background: "#f8f9fa", padding: "20px" };
const iconCircle = { width: 60, height: 60, background: '#e6f7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const topicGrid = { display: 'flex', gap: 20 };
const topicCard = { width: 250, borderRadius: 15 };
const contentContainer: any = { maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" };
const headerSection: any = { display: "flex", justifyContent: "space-between", background: '#fff', padding: '15px', borderRadius: 10 };
const suggestionCardBlue: any = { background: "#fff", padding: "20px", borderRadius: "15px", borderLeft: "5px solid #faad14", display: 'flex', alignItems: 'center' };
const mainGrid: any = { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px" };
const glassFrame: any = { background: "#fff", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", minHeight: "450px" };
const frameHeader: any = { marginBottom: "10px", fontWeight: "bold", color: "#8c8c8c" };
const voiceStageArea: any = { flex: 1, background: "#f0f5ff", borderRadius: "15px", display: 'flex', alignItems: 'center', justifyContent: 'center' };
const actionFooter: any = { textAlign: "center" };