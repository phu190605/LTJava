import { useEffect, useState } from "react";
import { getAdminProfile, updateAdminProfile } from "../../api/adminService";

export default function AdminProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminProfile().then((res) => {
      setProfile(res);
      setFullName(res.fullName);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await updateAdminProfile(fullName);
    setSaving(false);
    alert("✅ Cập nhật thành công");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={page}>
      <div style={wrapper}>
        <h2 style={title}>👤 Hồ sơ Admin</h2>

        <div style={card}>
          {/* Email */}
          <div style={field}>
            <label style={label}>Email</label>
            <div style={readonly}>{profile.email}</div>
          </div>

          {/* Full name */}
          <div style={field}>
            <label style={label}>Họ tên</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={input}
              placeholder="Nhập họ tên admin"
            />
          </div>

          <button onClick={save} disabled={saving} style={button}>
            {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== CSS ===================== */

const page: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "24px 16px",
};

const wrapper: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
};

const title: React.CSSProperties = {
  marginBottom: 16,
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const field: React.CSSProperties = {
  marginBottom: 16,
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
};

const readonly: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  background: "#f1f5f9",
  border: "1px solid #e5e7eb",
  fontSize: 14,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const button: React.CSSProperties = {
  marginTop: 8,
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};
