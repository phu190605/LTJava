import { useState } from "react";
import { submitFeedback } from "../api/mentorService";

type Props = {
  sessionId: string;
};

export default function FeedbackForm({ sessionId }: Props) {
  const [comment, setComment] = useState("");
  const [level, setLevel] = useState("B1");

  const handleSubmit = async () => {
    if (!comment) {
      alert("Vui lòng nhập nhận xét");
      return;
    }

    await submitFeedback({
      sessionId,
      level,
      comment,
    });

    alert("Đã chấm & xếp lớp thành công!");
    setComment("");
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: 12 }}>Đánh giá & Xếp lớp</h3>

      {/* LEVEL */}
      <div style={{ marginBottom: 12 }}>
        <label>Trình độ</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #d1d5db",
          }}
        >
          <option value="A1">A1 – Beginner</option>
          <option value="A2">A2 – Elementary</option>
          <option value="B1">B1 – Intermediate</option>
          <option value="B2">B2 – Upper-Intermediate</option>
          <option value="C1">C1 – Advanced</option>
        </select>
      </div>

      {/* COMMENT */}
      <div style={{ marginBottom: 12 }}>
        <label>Nhận xét của mentor</label>
        <textarea
          placeholder="Đánh giá tổng quan về khả năng nói của học viên..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            minHeight: 100,
            padding: 8,
            marginTop: 4,
            borderRadius: 4,
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 16px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Xác nhận xếp lớp
      </button>
    </div>
  );
}
