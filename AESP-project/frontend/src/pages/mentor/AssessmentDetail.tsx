import { useParams } from "react-router-dom";
import FeedbackForm from "../../components/FeedbackForm";

export default function AssessmentDetail() {
  const { sessionId } = useParams();

  if (!sessionId) {
    return <div>Session không tồn tại</div>;
  }

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* LEFT: Audio + AI */}
      <div style={{ flex: 1 }}>
        {/* AudioPlayer ở đây */}
      </div>

      {/* RIGHT: Feedback */}
      <div style={{ flex: 1 }}>
        <FeedbackForm sessionId={sessionId} />
      </div>
    </div>
  );
}
