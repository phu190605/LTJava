import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionsByMentor } from "../../api/mentorSessionService";

export default function FeedbackList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSessionsByMentor("mentor01").then(res => {
      const pending = res.data.filter(
        s => s.status === "WAITING"
      );
      setSessions(pending);
    });
  }, []);

  return (
    <div>
      <h1>Chấm bài & sửa lỗi</h1>

      {sessions.map(s => (
        <div key={s.id}>
          <b>Session:</b> {s.topic}
          <br />
          <button
            onClick={() => navigate(`/mentor/feedback/${s.id}`)}
          >
            Chấm bài
          </button>
        </div>
      ))}
    </div>
  );
}
