import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessions } from "../../api/mentorService";

export default function AssessmentList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSessions("mentor01").then(res => setSessions(res.data));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>
        Đánh giá & Xếp lớp
      </h1>

      <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
        {sessions.map(s => (
          <div
            key={s.id}
            onClick={() => navigate(`/mentor/assessment/${s.id}`)}
            style={{
              padding: 12,
              borderBottom: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <b>{s.learnerName}</b>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Submitted: {s.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
