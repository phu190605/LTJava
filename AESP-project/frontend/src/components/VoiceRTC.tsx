import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useState } from "react";

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

  const toggleVoice = () => {
    setActive(!active);

    socket.send(
      JSON.stringify({
        type: active ? "VOICE_OFF" : "VOICE_ON",
        sender: userId,
        roomId
      })
    );
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Tooltip title={active ? "Tắt micro" : "Bật micro"}>
        <Button
          shape="circle"
          size="large"
          type={active ? "primary" : "default"}
          icon={active ? <AudioOutlined /> : <AudioMutedOutlined />}
          onClick={toggleVoice}
        />
      </Tooltip>
    </div>
  );
}
