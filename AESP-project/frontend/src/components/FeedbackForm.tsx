import { useState } from "react";
import { submitAssessment } from "../api/mentorService";

export default function FeedbackForm({ assessmentId }: { assessmentId: number }) {
  const [level, setLevel] = useState("B1");
  const [comment, setComment] = useState("");

  const submit = async () => {
    await submitAssessment({
      assessmentId,       // gửi đúng assessmentId
      finalLevel: level,
      mentorComment: comment,
    });
    alert("Xếp lớp thành công");
  };

  return (
    <div>
      <h3>Xếp loại</h3>
      <select value={level} onChange={e => setLevel(e.target.value)}>
        <option>A1</option>
        <option>A2</option>
        <option>B1</option>
        <option>B2</option>
        <option>C1</option>
      </select>

      <textarea
        placeholder="Nhận xét tổng quan năng lực học viên"
        value={comment}
        onChange={e => setComment(e.target.value)}
        style={{ width: "100%", marginTop: 12 }}
      />

      <button onClick={submit} style={{ marginTop: 12 }}>
        Xác nhận xếp lớp
      </button>
    </div>
  );
}
