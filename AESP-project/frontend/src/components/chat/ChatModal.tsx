import { Modal, Input, Button, Avatar, Empty, message, Image } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  UserOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import dayjs from "dayjs";
import axiosClient from "../../api/axiosClient";

const FILE_BASE_URL = "http://localhost:8080";

interface ChatUser {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

interface ChatMessage {
  senderId: number;
  receiverId: number;
  conversationId: number;
  content: string;
  type?: "TEXT" | "FILE" | "IMAGE";
  fileUrl?: string;
  createdAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;

  // ✅ conversationId BẮT BUỘC truyền từ page (mentor / learner)
  conversationId: number;

  currentUser: ChatUser;
  targetUser: ChatUser;
}

export default function ChatModal({
  open,
  onClose,
  conversationId,
  currentUser,
  targetUser,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const stompClient = useRef<Client | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== LOAD CHAT HISTORY =====
  useEffect(() => {
    if (!open || !conversationId) return;

    setMessages([]);

    (async () => {
      try {
        const res = await axiosClient.get(
          `/chat/history/${conversationId}`
        );
        setMessages(Array.isArray(res) ? res : []);
      } catch {
        message.error("Không tải được lịch sử chat");
      }
    })();
  }, [open, conversationId]);

  // ===== SOCKET =====
  useEffect(() => {
    if (!open || !conversationId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${conversationId}`, (msg) => {
          const body: ChatMessage = JSON.parse(msg.body);

          if (!body.createdAt) {
            body.createdAt = new Date().toISOString();
          }

          setMessages((prev) => [...prev, body]);
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      stompClient.current?.deactivate();
      stompClient.current = null;
    };
  }, [open, conversationId]);

  // ===== AUTO SCROLL =====
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== SEND TEXT =====
  const sendMessage = () => {
    if (!text.trim() || !stompClient.current) return;

    stompClient.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        conversationId,
        senderId: currentUser.id,
        receiverId: targetUser.id,
        content: text,
        type: "TEXT",
      }),
    });

    setText("");
  };

  // ===== SEND FILE / IMAGE =====
  const sendFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res: any = await axiosClient.post("/chat/upload", formData);
      const { url, type } = res;

      stompClient.current?.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          conversationId,
          senderId: currentUser.id,
          receiverId: targetUser.id,
          content: file.name,
          fileUrl: url,
          type,
        }),
      });
    } catch {
      message.error("Upload file thất bại");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      bodyStyle={{ padding: 0 }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        <Avatar src={targetUser.avatarUrl} icon={<UserOutlined />} size={40} />
        <div>
          <div style={{ fontWeight: 600 }}>{targetUser.fullName}</div>
          <div style={{ fontSize: 12, color: "#22c55e" }}>● Online</div>
        </div>
      </div>

      {/* BODY */}
      <div
        style={{
          height: 400,
          overflowY: "auto",
          padding: 20,
          background: "#f8fafc",
        }}
      >
        {messages.length === 0 ? (
          <Empty description="Chưa có tin nhắn" />
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === currentUser.id;
            const fullUrl = m.fileUrl ? FILE_BASE_URL + m.fileUrl : "";

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: 16,
                }}
              >
                {!isMe && (
                  <Avatar
                    src={targetUser.avatarUrl}
                    icon={<UserOutlined />}
                    style={{ marginRight: 8 }}
                  />
                )}

                <div
                  style={{
                    background: isMe ? "#2563eb" : "#fff",
                    color: isMe ? "#fff" : "#000",
                    padding: "12px 16px",
                    borderRadius: 18,
                    maxWidth: "65%",
                  }}
                >
                  {m.type === "IMAGE" && m.fileUrl && (
                    <Image
                      src={fullUrl}
                      style={{ maxWidth: 220, borderRadius: 8 }}
                      preview={{ mask: "Xem ảnh" }}
                    />
                  )}

                  {m.type === "FILE" && m.fileUrl && (
                    <a href={fullUrl} target="_blank" rel="noreferrer">
                      📎 {m.content}
                    </a>
                  )}

                  {!m.type || m.type === "TEXT" ? (
                    <div>{m.content}</div>
                  ) : null}

                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.6,
                      textAlign: "right",
                      marginTop: 6,
                    }}
                  >
                    {m.createdAt
                      ? dayjs(m.createdAt).format("HH:mm")
                      : ""}
                  </div>
                </div>

                {isMe && (
                  <Avatar
                    src={currentUser.avatarUrl}
                    icon={<UserOutlined />}
                    style={{ marginLeft: 8 }}
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 16,
          borderTop: "1px solid #eee",
        }}
      >
        <Button
          icon={<PaperClipOutlined />}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              sendFile(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />
        <Input.TextArea
          value={text}
          rows={1}
          autoSize
          placeholder="Nhập tin nhắn..."
          onChange={(e) => setText(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
      </div>
    </Modal>
  );
}
