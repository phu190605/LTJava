import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const stompClient = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  reconnectDelay: 5000,
  debug: () => {}
});
