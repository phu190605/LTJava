import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FeedbackForm from "../../components/FeedbackForm";
import AudioPlayer from "../../components/AudioPlayer";
import { getFeedback } from "../../api/mentorService";

export default function FeedbackDetail() {
  const { sessionId } = useParams();
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;

    getFeedback(sessionId).then(res => {
      setAudioUrl(res.data.audioUrl);
    });
  }, [sessionId]);

  if (!sessionId) {
    return <div>Session không tồn tại</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Đánh giá & Xếp lớp
      </h1>

      <div
        style={{
          display: "flex",
          gap: 24,
        }}
      >
        {/* LEFT: AUDIO */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Bài nói của học viên</h3>

          {audioUrl ? (
            <AudioPlayer src={audioUrl} />
          ) : (
            <div style={{ color: "#64748b" }}>
              Đang tải audio...
            </div>
          )}
        </div>

        {/* RIGHT: FEEDBACK FORM */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <FeedbackForm sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}
