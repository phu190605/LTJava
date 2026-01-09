import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionsForMentor } from "../../api/mentorApi";
import type { LearningSession } from "../../types/mentor";
import { getMentorId } from "../../utils/auth";

export default function FeedbackList() {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mentorId = getMentorId();
    if (!mentorId) return;

    getSessionsForMentor(mentorId)
      .then(res =>
        setSessions(res.data.filter(s => s.status === "FINISHED"))
      );
  }, []);

  return (
    <div>
      <h2>Đã chấm</h2>

      {sessions.map(s => (
        <div
          key={s.id}
          className="mentor-card"
          onClick={() => navigate(`/mentor/feedback/${s.id}`)}
        >
          <strong>{s.topic}</strong>
        </div>
      ))}
    </div>
  );
}
