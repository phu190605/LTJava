import { Outlet, useNavigate } from "react-router-dom";

export default function MentorLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          background: "#1e293b",
          color: "#fff",
          padding: 20,
          height: "100vh",
          overflowY: "auto", // scroll nếu menu dài
        }}
      >
        <h3>Mentor</h3>

        <p
          style={{ cursor: "pointer", margin: "10px 0" }}
          onClick={() => navigate("/mentor")}
        >
          Dashboard
        </p>

        {/* Feedback chỉ cần link chung, sẽ dùng sessionId ở Dashboard */}
        <p
          onClick={() => navigate("/mentor/feedback")}
          style={{ cursor: "pointer", margin: "10px 0", opacity: 0.5 }}
        >
          Feedback
        </p>

        <p
          style={{ cursor: "pointer", margin: "10px 0" }}
          onClick={() => navigate("/mentor/materials")}
        >
          Kho tài liệu
        </p>
      </div>

      {/* Nội dung chính */}
      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto", // scroll nếu nội dung dài
          background: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
