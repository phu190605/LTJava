import type { LearningSession } from "../types/mentor";
import { useNavigate } from "react-router-dom";

interface Props {
  session: LearningSession;
}

export default function SessionCard({ session }: Props) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <h3>Topic: {session.topic}</h3>
      <p>Status: {session.status}</p>

      <button
        onClick={() => navigate(`/mentor/feedback/${session.id}`)}
        style={{
          marginTop: 8,
          padding: "6px 12px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Give Feedback
      </button>
    </div>
  );
}
