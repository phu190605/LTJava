import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer";
import SessionFeedbackForm from "../../components/SessionFeedbackForm";
import { getSessionDetail } from "../../api/mentorSessionService";

export default function FeedbackDetail() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    getSessionDetail(sessionId).then(res => {
      setAudioUrl(res.data.audioUrl);
    });
  }, [sessionId]);

  if (!sessionId) return <div>Session không tồn tại</div>;

  return (
    <div>
      <h1>Chấm bài Speaking</h1>

      <div style={{ display: "flex", gap: 24 }}>
        {/* AUDIO */}
        <div style={{ flex: 1 }}>
          <h3>Bài nói của học viên</h3>
          {audioUrl ? (
            <AudioPlayer src={audioUrl} />
          ) : (
            <p>Đang tải audio...</p>
          )}
        </div>

        {/* FEEDBACK */}
        <div style={{ flex: 1 }}>
          <SessionFeedbackForm sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}
