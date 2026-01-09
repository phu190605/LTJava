import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionsForMentor } from "../../api/mentorApi";
import type { LearningSession } from "../../types/mentor";
import { getMentorId } from "../../utils/auth";

export default function MentorDashboard() {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mentorId = getMentorId();
    if (!mentorId) return;

    getSessionsForMentor(mentorId)
      .then(res => setSessions(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Dashboard - Bài cần chấm</h2>

      {sessions.length === 0 && <p>Không có bài nào cần chấm.</p>}

      {sessions.map(s => (
        <div key={s.id} className="mentor-card">
          <p>Học viên: {s.learnerId}</p>
          <p>Topic: {s.topic}</p>
          <p>Trạng thái: {s.status}</p>

          <button
            className="btn btn-primary"
            onClick={() => navigate(`/mentor/feedback/${s.id}`)}
          >
            Chấm bài
          </button>
        </div>
      ))}
    </div>
  );
}
