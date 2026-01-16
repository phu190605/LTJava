import { useState } from "react";
import { submitSessionFeedback } from "../api/mentorSessionService";

interface Props {
  sessionId: string;
}

export default function SessionFeedbackForm({ sessionId }: Props) {
  const [comment, setComment] = useState("");
  const [grammar, setGrammar] = useState(8);
  const [pronunciation, setPronunciation] = useState(8);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      await submitSessionFeedback({
        sessionId,
        comment,
        grammarScore: grammar,
        pronunciationScore: pronunciation,
        timeStamp: new Date().toISOString(),
      });

      alert("Đã gửi feedback thành công");
      setComment("");
    } catch (e) {
      alert("Gửi feedback thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Nhận xét & Chấm điểm</h3>

      <label>Grammar</label>
      <input
        type="number"
        min={0}
        max={10}
        value={grammar}
        onChange={(e) => setGrammar(Number(e.target.value))}
      />

      <label>Pronunciation</label>
      <input
        type="number"
        min={0}
        max={10}
        value={pronunciation}
        onChange={(e) => setPronunciation(Number(e.target.value))}
      />

      <textarea
        placeholder="Nhận xét chi tiết cho học viên"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: "100%", marginTop: 12 }}
      />

      <button
        onClick={submit}
        disabled={loading}
        style={{ marginTop: 12 }}
      >
        {loading ? "Đang gửi..." : "Gửi feedback"}
      </button>
    </div>
  );
}
