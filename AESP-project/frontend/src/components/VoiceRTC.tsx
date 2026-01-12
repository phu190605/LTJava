import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Tooltip, message, Modal } from "antd";
import { useState, useEffect, useRef } from "react";

export default function VoiceRTC({
  socket,
  userId,
  roomId
}: {
  socket: WebSocket;
  userId: string;
  roomId: string;
}) {
  const [active, setActive] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(new Audio());

  const initPeer = () => {
    if (pc.current) return;
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.current.onicecandidate = (e) => {
      if (e.candidate) send("VOICE_SIGNAL", { candidate: e.candidate }, "CANDIDATE");
    };

    pc.current.ontrack = (e) => {
      remoteAudioRef.current.srcObject = e.streams[0];
      remoteAudioRef.current.play();
    };
  };

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.sender === userId) return;

      switch (data.type) {
        case "VOICE_REQUEST":
          Modal.confirm({
            title: "Yêu cầu gọi thoại",
            content: "Người kia muốn nói chuyện trực tiếp với bạn, bạn có đồng ý?",
            okText: "Đồng ý",
            cancelText: "Từ chối",
            onOk: () => handleAccept(),
            onCancel: () => send("VOICE_REJECT", {})
          });
          break;

        case "VOICE_REJECT":
          message.error("Đối phương đã từ chối yêu cầu.");
          stopEverything();
          break;

        case "VOICE_ACCEPT":
          message.success("Đối phương đã đồng ý! Đang kết nối...");
          startAudioStream(true);
          break;

        case "VOICE_SIGNAL":
          if (data.subType === "OFFER") {
            await handleOffer(data.content);
          } else if (data.subType === "ANSWER") {
            await pc.current?.setRemoteDescription(new RTCSessionDescription(data.content.sdp));
          } else if (data.subType === "CANDIDATE") {
            await pc.current?.addIceCandidate(new RTCIceCandidate(data.content.candidate));
          }
          break;

        case "VOICE_OFF":
          stopEverything();
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
      stopEverything();
    };
  }, [socket, userId, roomId]);

  const send = (type: string, content: any, subType?: string) => {
    socket.send(JSON.stringify({ type, subType, content, sender: userId, roomId }));
  };

  const stopEverything = () => {
    localStream.current?.getTracks().forEach(t => t.stop());
    localStream.current = null;
    pc.current?.close();
    pc.current = null;
    setActive(false);
  };

  const toggleVoice = () => {
    if (!active) {
      send("VOICE_REQUEST", {});
      setActive(true);
      message.loading("Đang chờ đối phương đồng ý...", 0);
    } else {
      send("VOICE_OFF", {});
      stopEverything();
    }
  };

  const handleAccept = () => {
    send("VOICE_ACCEPT", {});
    startAudioStream(false);
  };

  const startAudioStream = async (isCaller: boolean) => {
    try {
      message.destroy();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      initPeer();

      stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));
      setActive(true);

      if (isCaller) {
        const offer = await pc.current!.createOffer();
        await pc.current!.setLocalDescription(offer);
        send("VOICE_SIGNAL", { sdp: offer }, "OFFER");
      }
    } catch (err) {
      message.error("Lỗi truy cập Microphone!");
      stopEverything();
    }
  };

  const handleOffer = async (content: any) => {
    initPeer();
    if (!localStream.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));
    }

    await pc.current?.setRemoteDescription(new RTCSessionDescription(content.sdp));
    const answer = await pc.current?.createAnswer();
    await pc.current?.setLocalDescription(answer);
    send("VOICE_SIGNAL", { sdp: answer }, "ANSWER");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Tooltip title={active ? "Kết thúc" : "Bật Mic"}>
        <Button
          shape="circle"
          size="large"
          type={active ? "primary" : "default"}
          danger={active}
          icon={active ? <AudioOutlined /> : <AudioMutedOutlined />}
          onClick={toggleVoice}
        />
      </Tooltip>
    </div>
  );
}