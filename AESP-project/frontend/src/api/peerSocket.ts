import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import type { CompatClient, IMessage } from '@stomp/stompjs';

let stompClient: CompatClient | null = null;

// 👇 SỬA DÒNG NÀY: Thêm tham số onConnected vào cuối
export function connect(clientId: string, onMatchMessage: (msg: any) => void, onConnected?: () => void) {
  if (stompClient && stompClient.connected) {
    if (onConnected) onConnected();
    return;
  }

  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(() => socket);
  stompClient.reconnectDelay = 5000;
  
  stompClient.onConnect = () => {
    console.log('✅ Connected to WebSocket!');
    
    // Subscribe nhận kết quả ghép đôi
    stompClient?.subscribe(`/topic/match/${clientId}`, (message: IMessage) => {
      const body = JSON.parse(message.body);
      onMatchMessage(body);
    });

    // 👇 QUAN TRỌNG: Gọi hàm callback (gửi request) sau khi đã kết nối thành công
    if (onConnected) {
      onConnected();
    }
  };

  stompClient.activate();
}

export function sendMatchRequest(req: { clientId: string; topic: string; level: string }) {
  if (!stompClient || !stompClient.connected) {
    console.error('❌ Chưa kết nối Socket, không thể gửi yêu cầu!');
    return;
  }
  console.log('📤 Sending Match Request:', req);
  stompClient.publish({destination: '/app/match', body: JSON.stringify(req)});
}

// ... Các hàm khác giữ nguyên
export function subscribeRoom(roomId: string, handler: (msg: any) => void) {
  if (!stompClient || !stompClient.connected) return;
  stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
    try { handler(JSON.parse(message.body)); }
    catch (e) { handler(message.body); }
  });
}

export function sendRoomMessage(roomId: string, payload: any) {
  if (!stompClient || !stompClient.connected) return;
  stompClient.publish({destination: `/app/room/${roomId}/message`, body: JSON.stringify(payload)});
}

export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}