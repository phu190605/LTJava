import { useEffect, useRef, useState, useCallback } from "react";
import { Card, Button, Space, Spin, Typography, Tag, Modal } from "antd";
import {
  TeamOutlined,
  StopOutlined,
  MessageOutlined,
  BulbOutlined,
  RocketOutlined
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
  { key: "DAILY", label: "Hàng ngày" },
  { key: "TRAVEL", label: "Du lịch" },
  { key: "BUSINESS", label: "Kinh doanh" }
];

type Topic = {
  key: string;
  label: string;
};

/* ================= COMPONENT ================= */

export default function PeerRoom() {
  const userIdRef = useRef("user_" + Math.floor(Math.random() * 100000));
  const userId = userIdRef.current;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /* ================= SOCKET ================= */

  const startConnection = useCallback(() => {
    connectPeerSocket((msg: any) => {
      console.log("WS:", msg);

      if (msg.type === "MATCHED") setRoomId(msg.roomId);

      if (msg.type === "CHAT" && msg.sender !== userId) {
        setMessages(prev => [...prev, msg]);
      }

      if (msg.type === "TOPIC_SUGGESTION") {
        setSuggestion(msg.content);
      }

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

  /* ================= CHOOSE TOPIC ================= */

  if (!topic) {
    return (
      <div style={centerWrap}>
        <Card style={cardStyle}>
          <RocketOutlined style={{ fontSize: 42, color: "#1890ff" }} />
          <Title level={2}>Luyện nói tiếng Anh</Title>
          <Text type="secondary">Chọn chủ đề để ghép người lạ</Text>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {TOPICS.map(t => (
              <Button
                key={t.key}
                size="large"
                type="primary"
                ghost
                style={{ borderRadius: 14, height: 50 }}
                onClick={() => handleJoin(t)}
              >
                Chủ đề: {t.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  /* ================= WAITING ================= */

  if (!roomId) {
    return (
      <div style={centerWrap}>
        <Card style={cardStyle}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 20 }}>
            Đang tìm người phù hợp...
          </Title>
          <Tag color="blue">Chủ đề: {topic.label}</Tag>
          <div style={{ marginTop: 12 }}>
            <Button danger type="link" onClick={resetRoom}>
              Hủy
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ================= MATCHED (UI PRO, CÓ KHUNG VOICE vs CHAT) ================= */

  return (
    <div style={matchedBg}>
      <Card style={mainCard} bodyStyle={{ padding: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "85vh" }}>

          {/* HEADER */}
          <div style={headerBar}>
            <Space>
              <div style={avatar}>
                <TeamOutlined style={{ fontSize: 20, color: "#1890ff" }} />
              </div>
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Đã kết nối
                </Title>
                <Text type="secondary">Room: {roomId.split("-")[0]}</Text>
              </div>
            </Space>

            <Space>
              <Tag color="blue">CHỦ ĐỀ: {topic.label}</Tag>
              <Tag color="green">LIVE</Tag>
            </Space>
          </div>

          {/* SUGGESTION */}
          {suggestion && (
            <div style={suggestionBar}>
              <BulbOutlined style={{ fontSize: 20, color: "#faad14" }} />
              <Text strong style={{ marginLeft: 12 }}>
                {suggestion}
              </Text>
            </div>
          )}

          {/* BODY */}
          <div style={mainGrid}>
            {/* VOICE */}
            <div style={voicePanel}>
              <div style={panelHeader}>
                <TeamOutlined />
                <Text strong>Voice</Text>
              </div>

              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <VoiceRTC socket={getPeerSocket()} userId={userId} roomId={roomId} />
              </div>

              <Button
                danger
                icon={<StopOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: "Kết thúc cuộc trò chuyện?",
                    onOk: () => {
                      finishRoom(userId, roomId);
                      resetRoom();
                    }
                  });
                }}
              >
                Kết thúc
              </Button>
            </div>

            {/* CHAT */}
            <div style={chatPanel}>
              <div style={panelHeader}>
                <MessageOutlined />
                <Text strong>Chat</Text>
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

        </div>
      </Card>
    </div>
  );
}

/* ================= STYLES ================= */

const centerWrap = {
  minHeight: "100vh",
  background: "#f0f5ff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const cardStyle = {
  width: 420,
  borderRadius: 24,
  textAlign: "center",
  boxShadow: "0 10px 40px rgba(24,144,255,0.1)"
};

const matchedBg = {
  minHeight: "100vh",
  background: "#f5f7fa",
  padding: 24
};

const mainCard = {
  maxWidth: 1100,
  margin: "0 auto",
  borderRadius: 24,
  overflow: "hidden"
};

const headerBar = {
  padding: "16px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee"
};

const avatar = {
  width: 42,
  height: 42,
  background: "#e6f7ff",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const suggestionBar = {
  padding: "16px 32px",
  background: "#fffbe6",
  borderBottom: "1px solid #ffe58f",
  display: "flex",
  alignItems: "center"
};

const mainGrid = {
  flex: 1,
  display: "grid",
  gridTemplateColumns: "1fr 1.4fr"
};

const voicePanel = {
  padding: 24,
  borderRight: "1px solid #eee",
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const chatPanel = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const panelHeader = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  borderBottom: "1px solid #eee",
  paddingBottom: 8
};
