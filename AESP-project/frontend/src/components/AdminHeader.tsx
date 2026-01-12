import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProfile } from "../api/adminService";

export default function AdminHeader() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminProfile().then((res) => {
      setAvatarUrl(res.data.avatarUrl || null);
    });
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div
      style={{
        height: 56,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #e5e7eb",
        position: "relative",
      }}
    >
      <div />

      {/* AVATAR */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
            border: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f1f5f9",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        {/* DROPDOWN */}
        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 44,
              width: 160,
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            <div
              onClick={() => {
                navigate("/admin/profile");
                setOpen(false);
              }}
              style={menuItem}
            >
              Hồ sơ admin
            </div>

            <div
              onClick={logout}
              style={{ ...menuItem, color: "#dc2626" }}
            >
              Đăng xuất
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const menuItem: React.CSSProperties = {
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: 14,
  borderBottom: "1px solid #f1f5f9",
};
