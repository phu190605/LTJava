import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingAssessments } from "../../api/mentorService";
import type { Assessment } from "../../types/mentor";

export default function AssessmentList() {
  const [list, setList] = useState<Assessment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPendingAssessments().then(res => setList(res.data));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Đánh giá & Xếp lớp</h1>

      {list.length === 0 && <p>Chưa có bài test mới</p>}

      <div style={{ background: "#fff", borderRadius: 8 }}>
        {list.map(a => (
          <div
            key={a.id}
            onClick={() =>
              navigate(`/mentor/assessment/${a.userId}`)
            }
            style={{
              padding: 16,
              borderBottom: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <b>User ID: {a.userId}</b>
            <div>AI Score: {a.score}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Submitted: {new Date(a.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
