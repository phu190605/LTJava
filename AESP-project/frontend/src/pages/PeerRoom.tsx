/* uth.edu package */
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, Button, Space, Spin, Typography, Tag, Modal } from "antd";
import { TeamOutlined, StopOutlined, MessageOutlined, BulbOutlined, RocketOutlined } from "@ant-design/icons";

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

const TOPICS = [
  { key: "DAILY", label: "Hàng ngày" },
  { key: "TRAVEL", label: "Du lịch" },
  { key: "BUSINESS", label: "Kinh doanh" }
];

type Topic = {
  key: string;
  label: string;
};

export default function PeerRoom() {
  const userIdRef = useRef("user_" + Math.floor(Math.random() * 100000));
  const userId = userIdRef.current;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // ================= SOCKET =================
  const startConnection = useCallback(() => {
    connectPeerSocket((msg: any) => {
      console.log("WS:", msg);

      if (msg.type === "MATCHED") setRoomId(msg.roomId);
      if (msg.type === "CHAT" && msg.sender !== userId)
        setMessages(prev => [...prev, msg]);
      if (msg.type === "TOPIC_SUGGESTION")
        setSuggestion(msg.content);

      if (msg.type === "ROOM_FINISHED" || msg.type === "USER_OFFLINE") {
        Modal.warning({
          title: msg.type === "ROOM_FINISHED" ? "Kết thúc" : "Đối phương rời đi",
          content: msg.content,
          onOk: resetRoom
        });
      }
    });
    setIsConnected(true);
  }, [userId]);

  useEffect(() => {
    return () => disconnectPeerSocket();
  }, []);

  const resetRoom = () => {
    setRoomId(null);
    setMessages([]);
    setSuggestion(null);
    setTopic(null);
    setIsConnected(false);
    disconnectPeerSocket();
  };

  const handleJoin = (t: Topic) => {
    setTopic(t);
    startConnection();
    setTimeout(() => joinRoom(userId, t.key), 400);
  };

  // ================= CHOOSE TOPIC =================
  if (!topic) {
    return (
      <div style={centerWrap}>
        <Card style={cardStyle}>
          <RocketOutlined style={{ fontSize: 42, color: '#1890ff', marginBottom: 16 }} />
          <Title level={2}>Luyện nói Tiếng Anh</Title>
          <Text type="secondary">Chọn một chủ đề để kết nối người lạ</Text>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOPICS.map(t => (
              <Button key={t.key} type="primary" size="large" ghost
                style={{ borderRadius: 14, height: 52, fontSize: 16 }}
                onClick={() => handleJoin(t)}>
                Chủ đề: {t.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ================= WAITING =================
  if (!roomId) {
    return (
      <div style={centerWrap}>
        <Card style={cardStyle}>
          <Spin size="large" tip="Đang tìm người phù hợp..." />
          <Title level={4} style={{ marginTop: 24 }}>Vui lòng đợi</Title>
          <Tag color="blue">Chủ đề: {topic.label}</Tag>
          <div style={{ marginTop: 12 }}>
            <Button type="link" danger onClick={resetRoom}>Hủy</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ================= MATCHED =================
  return (
    <div style={matchedBg}>
      <Card style={mainCardStyle} bodyStyle={{ padding: '32px' }}>
        <Space direction="vertical" size={32} style={{ width: "100%" }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={16}>
              <div style={{ width: 48, height: 48, background: '#e6f7ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>Đã kết nối</Title>
                <Text type="secondary">Room: {roomId.split("-")[0]}</Text>
              </div>
            </Space>
            <Tag color="blue">CHỦ ĐỀ: {topic.label}</Tag>
          </div>

          {/* Suggestion */}
          {suggestion && (
            <div style={suggestionBox}>
              <Space direction="vertical">
                <Text strong><BulbOutlined /> GỢI Ý THẢO LUẬN</Text>
                <Title level={2}>"{suggestion}"</Title>
              </Space>
            </div>
          )}

          {/* Voice vs Chat Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, minHeight: 450 }}>

            <div style={voicePanelPro}>
              <div style={panelHeader}>
                <TeamOutlined style={{ color: '#1890ff' }} />
                <Text strong>Voice Chat</Text>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <VoiceRTC socket={getPeerSocket()} userId={userId} roomId={roomId} />
              </div>
              <Text type="secondary">Nhấn micro để bắt đầu nói</Text>
            </div>

            <div style={chatPanelPro}>
              <div style={panelHeader}>
                <MessageOutlined style={{ color: '#1890ff' }} />
                <Text strong>Text Chat</Text>
              </div>
              <div style={{ flex: 1 }}>
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

          <div style={{ textAlign: 'center' }}>
            <Button danger shape="round" icon={<StopOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "Kết thúc?",
                  onOk: () => { finishRoom(userId, roomId); resetRoom(); }
                });
              }}>
              Dừng cuộc hội thoại
            </Button>
          </div>

        </Space>
      </Card>
    </div>
  );
}

/* ================= STYLES ================= */

const centerWrap = {
  minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f5ff"
};

const cardStyle = {
  width: 480, borderRadius: 24, textAlign: "center", boxShadow: '0 10px 40px rgba(24,144,255,0.1)'
};

const matchedBg = {
  minHeight: "100vh", background: "#f8f9fb", padding: "60px 20px"
};

const mainCardStyle = {
  maxWidth: 1000, margin: "0 auto", borderRadius: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
};

const suggestionBox = {
  background: '#fffbe6', padding: 28, borderRadius: 20, border: '1px solid #ffe58f'
};

const voicePanelPro = {
  background: '#ffffff',
  border: '1px solid #e6f4ff',
  borderRadius: 24,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow: '0 6px 20px rgba(24,144,255,0.06)'
};

const chatPanelPro = {
  background: '#ffffff',
  border: '1px solid #e6f4ff',
  borderRadius: 24,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow: '0 6px 20px rgba(24,144,255,0.06)'
};

const panelHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  paddingBottom: 10,
  borderBottom: '1px solid #f0f0f0'
};
