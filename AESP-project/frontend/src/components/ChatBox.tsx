
import { Input, List, Typography, Card } from "antd";
import { useState, useEffect, useRef } from "react";

const { Text } = Typography;

// Định nghĩa lại cấu trúc Message để chứa cả ID và Name
type Message = {
  sender: string;     // Đây là ID để máy tính so sánh (ví dụ: "1")
  senderName?: string; // Đây là tên từ SQL để hiển thị (ví dụ: "phu")
  content: string;
};

export default function ChatBox({
  messages,
  currentUser, // ID của người dùng hiện tại
  onSend
}: {
  messages: Message[];
  currentUser: string; 
  onSend: (content: string) => void;
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card 
      title="💬 Chat Room" 
      styles={{ body: { padding: "10px", display: "flex", flexDirection: "column", height: "400px" } }}
    >
      <div 
        ref={scrollRef} 
        style={{ flex: 1, overflowY: "auto", marginBottom: "10px", paddingRight: "5px" }}
      >
        <List
          dataSource={messages}
          split={false}
          renderItem={(item) => {
            // --- LOGIC QUAN TRỌNG: So sánh dựa trên ID ---
            const isMe = String(item.sender) === String(currentUser);

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
                  {/* HIỂN THỊ TÊN NGƯỜI GỬI (LẤY TỪ SQL) */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: "#8c8c8c",
                      marginBottom: 2,
                      padding: isMe ? "0 4px 0 0" : "0 0 0 4px"
                    }}
                  >
                    {/* Nếu là mình thì hiện "Bạn", nếu là đối phương thì hiện tên thật (senderName) 
                        Nếu senderName trống thì mới dùng ID (item.sender) làm dự phòng */}
                    {isMe ? "Bạn" : (item.senderName || item.sender)}
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