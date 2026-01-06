// layouts/AdminLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#1e293b", color: "#fff", padding: 20 }}>
        <h3>Admin</h3>
        <p onClick={() => navigate("/admin")}>Dashboard</p>
        <p onClick={() => navigate("/admin/users")}>Users</p>
        <p onClick={() => navigate("/admin/mentors")}>Mentors</p>
        <p onClick={() => navigate("/admin/policies")}>Policies</p>
      </div>

      {/* Nội dung */}
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}

