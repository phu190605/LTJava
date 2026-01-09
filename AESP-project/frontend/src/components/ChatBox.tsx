import { Input, List, Typography, Card } from "antd";
import { useState } from "react";

const { Text } = Typography;

type Message = {
  sender: string;
  content: string;
};

export default function ChatBox({
  messages,
  currentUser,
  onSend
}: {
  messages: Message[];
  currentUser: string;
  onSend: (content: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <Card title="💬 Chat">
      <List
        dataSource={messages}
        renderItem={(item) => {
          const isMe = item.sender === currentUser;

          return (
            <List.Item
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "8px 12px",
                  borderRadius: 16,
                  background: isMe ? "#d6f4ff" : "#f0f0f0",
                  textAlign: "left"
                }}
              >
                {/* 🔹 HIỂN THỊ TÊN NGƯỜI GỬI */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    opacity: 0.7,
                    marginBottom: 4
                  }}
                >
                  {isMe ? "Bạn" : item.sender}
                </div>

                <Text>{item.content}</Text>
              </div>
            </List.Item>
          );
        }}
      />

      <Input.Search
        placeholder="Nhập tin nhắn..."
        enterButton="Gửi"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onSearch={() => {
          if (!text.trim()) return;
          onSend(text);
          setText("");
        }}
      />
    </Card>
  );
}
