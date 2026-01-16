import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssessmentDetail } from "../../api/mentorService";
import type { Assessment } from "../../types/mentor";
import AudioPlayer from "../../components/AudioPlayer";
import FeedbackForm from "../../components/FeedbackForm";

export default function AssessmentDetail() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [data, setData] = useState<Assessment | null>(null);

  useEffect(() => {
    if (!assessmentId) return;

    getAssessmentDetail(Number(assessmentId))
      .then(res => setData(res.data))
      .catch(console.error);
  }, [assessmentId]);

  if (!data) return <div>Đang tải...</div>;

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      {/* LEFT: TEST CONTENT */}
      <div style={{ flex: 1 }}>
        <h3>Bài test đầu vào</h3>

        {/* AUDIO */}
        {data.audioUrl ? (
          <AudioPlayer src={data.audioUrl} />
        ) : (
          <div style={{ color: "#64748b", fontStyle: "italic" }}>
            Bài test chưa có file audio
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <b>AI Score:</b> {data.score}
        </div>

        <div style={{ marginTop: 8 }}>
          <b>AI Feedback:</b>
          <p>{data.feedback}</p>
        </div>
      </div>

      {/* RIGHT: ASSESSMENT FORM */}
      <div style={{ flex: 1 }}>
        <FeedbackForm assessmentId={data.id} />
      </div>
    </div>
  );
}
