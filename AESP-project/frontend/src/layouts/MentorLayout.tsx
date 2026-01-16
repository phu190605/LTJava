import { NavLink, Outlet } from "react-router-dom";
import MentorHeader from "../components/MentorHeader";
export default function MentorLayout() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9" }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: 220,
          background: "#fff",
          color: "#2563eb",
          padding: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>
          AESP Mentor
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <NavLink
            to="/mentor"
            end
            style={({ isActive }) => ({
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 6,
              background: isActive ? "#2563eb" : "transparent",
              color: isActive ? "#fff" : "#2563eb",
            })}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/mentor/assessment"
            style={({ isActive }) => ({
            textDecoration: "none",
            padding: "10px 12px",
            borderRadius: 6,
            background: isActive ? "#2563eb" : "transparent",
            color: isActive ? "#fff" : "#2563eb",
            })}
          >
            Đánh giá & xếp lớp
          </NavLink>

        <NavLink
        to="/mentor/feedbacks"
        style={({ isActive }) => ({
        textDecoration: "none",
        padding: "10px 12px",
        borderRadius: 6,
        background: isActive ? "#2563eb" : "transparent",
        color: isActive ? "#fff" : "#2563eb",
        })}
        >
        Chấm bài & sửa lỗi
        </NavLink>

          <NavLink
            to="/mentor/materials"
            style={({ isActive }) => ({
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: 6,
              background: isActive ? "#2563eb" : "transparent",
              color: isActive ? "#fff" : "#2563eb",
            })}
          >
            Kho tài liệu
          </NavLink>

        </nav>
      </aside>

      {/* CONTENT */}
<main
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f1f5f9",
  }}
>
  <MentorHeader />

  <div
    style={{
      flex: 1,
      padding: 24,
      overflowY: "auto",
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div style={{ width: "100%", maxWidth: 1000 }}>
      <Outlet />
    </div>
  </div>
</main>
    </div>
  );
}
