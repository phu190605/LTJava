import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitFeedback, getSessionsForMentor } from "../../api/mentorApi";
import type { LearningSession } from "../../types/mentor";
import "../../css/mentor.css";
import { getMentorId } from "../../utils/auth";

export default function FeedbackEditor() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const mentorId = getMentorId();

  const [session, setSession] = useState<LearningSession | null>(null);
  const [comment, setComment] = useState("");
  const [grammar, setGrammar] = useState(0);
  const [pronunciation, setPronunciation] = useState(0);

  useEffect(() => {
    if (!sessionId || !mentorId) return;

    getSessionsForMentor(mentorId)
      .then(res => {
        const found = res.data.find(s => s.id === sessionId);
        setSession(found ?? null);
      })
      .catch(console.error);
  }, [sessionId, mentorId]);

  const handleSubmit = async () => {
    if (!session) return;

    try {
      await submitFeedback({
        sessionId: session.id,
        comment,
        grammarScore: grammar,
        pronunciationScore: pronunciation,
        timeStamp: 0
      });

      alert("✅ Đã gửi feedback!");
      navigate("/mentor");
    } catch (err) {
      console.error(err);
      alert("❌ Gửi feedback thất bại");
    }
  };

  if (!session) {
    return <p>Session không tồn tại</p>;
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#fff",
        padding: 20,
        borderRadius: 6
      }}
    >
      <h2>Feedback Editor</h2>

      <p>
        <strong>Chủ đề:</strong> {session.topic}
      </p>

      <textarea
        className="mentor-textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Nhận xét buổi học..."
      />

      <div className="score-row">
        <label>
          Grammar:
          <input
            className="score-input"
            type="number"
            min={0}
            max={10}
            value={grammar}
            onChange={(e) => setGrammar(+e.target.value)}
          />
        </label>

        <label>
          Pronunciation:
          <input
            className="score-input"
            type="number"
            min={0}
            max={10}
            value={pronunciation}
            onChange={(e) => setPronunciation(+e.target.value)}
          />
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        📤 Gửi Feedback
      </button>
    </div>
  );
}
