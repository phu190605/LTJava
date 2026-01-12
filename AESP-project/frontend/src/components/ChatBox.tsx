/* uth.edu package */
import { Input, List, Typography, Card } from "antd";
import { useState, useEffect, useRef } from "react";

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
  currentUser: string; // Đây là Full Name (ví dụ: "phu1") truyền từ PeerRoom
  onSend: (content: string) => void;
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới để dễ theo dõi
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card 
      title="💬 Chat Room" 
      bodyStyle={{ padding: "10px", display: "flex", flexDirection: "column", height: "400px" }}
    >
      {/* Vùng danh sách tin nhắn có thể cuộn */}
      <div 
        ref={scrollRef} 
        style={{ flex: 1, overflowY: "auto", marginBottom: "10px", paddingRight: "5px" }}
      >
        <List
          dataSource={messages}
          split={false}
          renderItem={(item) => {
            // Kiểm tra xem người gửi có phải là mình không dựa trên Full Name
            const isMe = item.sender === currentUser;

            return (
              <List.Item
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  border: "none",
                  padding: "4px 0"
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    textAlign: isMe ? "right" : "left"
                  }}
                >
                  {/* 🔹 ĐÂY LÀ CỘT HIỂN THỊ FULL NAME LẤY TỪ SQL */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: "#8c8c8c",
                      marginBottom: 2,
                      padding: isMe ? "0 4px 0 0" : "0 0 0 4px"
                    }}
                  >
                    {isMe ? "Bạn" : item.sender}
                  </div>

                  <div
                    style={{
                      padding: "8px 14px",
                      borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      background: isMe ? "#1890ff" : "#f0f2f5",
                      color: isMe ? "#fff" : "#000",
                      display: "inline-block",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      textAlign: "left"
                    }}
                  >
                    <Text style={{ color: "inherit" }}>{item.content}</Text>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>

      {/* Ô nhập tin nhắn */}
      <Input.Search
        placeholder="Nhập tin nhắn..."
        enterButton="Gửi"
        size="large"
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