import { useEffect, useState } from "react";
import { getSessions } from "../../api/mentorService";
import { useNavigate } from "react-router-dom";

export default function FeedbackList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSessions("mentor01").then((res: any) => {
      const pending = res.data.filter(
        (s: any) => s.status === "PENDING_FEEDBACK"
      );
      setSessions(pending);
    });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Chấm bài & sửa lỗi
      </h1>

      {sessions.map(s => (
        <div
          key={s.id}
          style={{
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <b>{s.learnerName}</b> – {s.topic} ({s.level})

          <br />

          <button
            onClick={() => navigate(`/mentor/feedback/${s.id}`)}
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
            Chấm bài
          </button>
        </div>
      ))}
    </div>
  );
}
