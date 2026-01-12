import { NavLink, Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout() {
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
        {/* CHỈ KHÁC CHỖ NÀY */}
        <h2 style={{ textAlign: "center", marginBottom: 30 }}>
          AESP ADMIN
        </h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => navStyle(isActive)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            style={({ isActive }) => navStyle(isActive)}
          >
            Quản lý học viên
          </NavLink>

          <NavLink
            to="/admin/mentors"
            style={({ isActive }) => navStyle(isActive)}
          >
            Quản lý mentor
          </NavLink>

          <NavLink
            to="/admin/packages"
            style={({ isActive }) => navStyle(isActive)}
          >
            Quản lý gói dịch vụ
          </NavLink>

          <NavLink
            to="/admin/purchases"
            style={({ isActive }) => navStyle(isActive)}
          >
            Quản lý mua gói học
          </NavLink>

          <NavLink
            to="/admin/policies"
            style={({ isActive }) => navStyle(isActive)}
          >
            Chính sách hệ thống
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
        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT */}
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

/* ===== STYLE GIỐNG MENTOR ===== */
const navStyle = (isActive: boolean): React.CSSProperties => ({
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 6,
  background: isActive ? "#2563eb" : "transparent",
  color: isActive ? "#fff" : "#2563eb",
});
