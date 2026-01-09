export interface ChatMessage {
  type: string;
  sender: string;
  content?: string;
  roomId?: string;
  data?: any;
}