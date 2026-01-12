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

export function joinRoom(userId: string, topic: string) {
  socket?.send(JSON.stringify({
    type: "JOIN",
    sender: userId,
    content: topic
  }));
}

export function sendChat(userId: string, roomId: string, content: string) {
  socket?.send(JSON.stringify({
    type: "CHAT",
    sender: userId,
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