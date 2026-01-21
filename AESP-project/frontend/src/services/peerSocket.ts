/* uth.edu package */
let socket: WebSocket | null = null;

export function connectPeerSocket(onMessage: (msg: any) => void) {
  if (socket) return;

  socket = new WebSocket("ws://localhost:8080/peer");

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    onMessage(data);
  };

  socket.onclose = () => {
    socket = null;
  };
}

export function getPeerSocket(): WebSocket {
  if (!socket) throw new Error("Socket not connected");
  return socket;
}

/**
 * Gửi yêu cầu JOIN kèm theo fullName thực tế từ SQL để Server lưu vào Session
 */
export function joinRoom(userId: string, topic: string, fullName: string) {
  socket?.send(JSON.stringify({
    type: "JOIN",
    sender: userId,
    senderName: fullName, // Sử dụng fullName lấy từ SQL thay vì mặc định
    content: topic
  }));
}

/**
 * Gửi tin nhắn CHAT kèm theo fullName thực tế
 */
export function sendChat(userId: string, roomId: string, content: string, fullName: string) {
  socket?.send(JSON.stringify({
    type: "CHAT",
    sender: userId,
    senderName: fullName, // Đảm bảo Backend nhận được tên thật để hiển thị cho đối phương
    roomId,
    content
  }));
}

export function finishRoom(userId: string, roomId: string) {
  socket?.send(JSON.stringify({
    type: "ROOM_FINISHED",
    sender: userId,
    roomId
  }));
}

export function disconnectPeerSocket() {
  socket?.close();
  socket = null;
}