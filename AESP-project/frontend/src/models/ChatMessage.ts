
export interface ChatMessage {
  type: string;
  sender: string;     // ID người gửi (dùng để so sánh logic isMe)
  senderName?: string; // Tên hiển thị lấy từ SQL (ví dụ: "phu")
  content?: string;
  roomId?: string;
  data?: any;
}