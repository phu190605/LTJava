import { useEffect, useRef, useState } from "react";
import { Card, Button, Space, Spin, Typography, Tag, Modal } from "antd";
import { TeamOutlined, StopOutlined } from "@ant-design/icons";

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

  // 🔥 USER ID CỐ ĐỊNH – KHÔNG ĐƯỢC RANDOM LẠI
  const userIdRef = useRef("user_" + Math.floor(Math.random() * 100000));
  const userId = userIdRef.current;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    connectPeerSocket((msg: any) => {
      console.log("WS:", msg);

      if (msg.type === "MATCHED") {
        setRoomId(msg.roomId);
      }

      if (msg.type === "CHAT" && msg.sender !== userId) {
        setMessages(prev => [...prev, msg]);
      }

      if (msg.type === "TOPIC_SUGGESTION") {
        setSuggestion(msg.content);
      }

      if (msg.type === "ROOM_FINISHED") {
        Modal.info({
          title: "Cuộc trò chuyện đã kết thúc",
          content: msg.content,
          onOk: resetRoom
        });
      }

      if (msg.type === "USER_OFFLINE") {
        Modal.warning({
          title: "Đối phương đã rời phòng",
          content: msg.content,
          onOk: resetRoom
        });
      }
    });
  }, []); // ❗ KHÔNG CLEANUP SOCKET Ở ĐÂY

  /* ================= RESET ================= */
  const resetRoom = () => {
    setRoomId(null);
    setMessages([]);
    setSuggestion(null);
    setTopic(null);
    disconnectPeerSocket();
  };

  /* ================= CHỌN TOPIC ================= */
  if (!topic) {
    return (
      <div style={centerWrap}>
        <Card style={card}>
          <Title level={3}>Chọn chủ đề luyện nói</Title>
          <Space>
            {TOPICS.map(t => (
              <Button
                key={t.key}
                type="primary"
                onClick={() => {
                  setTopic(t);
                  joinRoom(userId, t.key);
                }}
              >
                {t.label}
              </Button>
            ))}
          </Space>
        </Card>
      </div>
    );
  }

  /* ================= WAITING ================= */
  if (!roomId) {
    return (
      <div style={centerWrap}>
        <Card style={card}>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 20 }}>
            Đang tìm bạn luyện nói...
          </Title>
          <Tag color="blue">Chủ đề: {topic.label}</Tag>
        </Card>
      </div>
    );
  }

  /* ================= MATCHED ================= */
  return (
    <div style={centerWrap}>
      <Card style={{ ...card, width: 600 }}>
        <Space direction="vertical" style={{ width: "100%" }}>

          <Title level={4}>
            <TeamOutlined /> Đã ghép cặp thành công
          </Title>

          <Tag color="green">Chủ đề: {topic.label}</Tag>
          <Text>Room ID: {roomId}</Text>

          <VoiceRTC
            socket={getPeerSocket()}
            userId={userId}
            roomId={roomId}
          />

          <ChatBox
            messages={messages}
            currentUser={userId}
            onSend={(content) => {
              setMessages(prev => [...prev, { sender: userId, content }]);
              sendChat(userId, roomId, content);
            }}
          />

          {suggestion && (
            <Card style={{ background: "#fffbe6" }}>
              💡 <b>Gợi ý câu hỏi:</b>
              <br />
              {suggestion}
            </Card>
          )}

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
            Kết thúc cuộc trò chuyện
          </Button>

        </Space>
      </Card>
    </div>
  );
}

const centerWrap = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f0f2f5"
};

const card = {
  width: 420,
  borderRadius: 16,
  textAlign: "center"
};
