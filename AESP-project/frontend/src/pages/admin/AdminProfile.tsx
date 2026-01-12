import { useEffect, useState } from "react";
import { getAdminProfile } from "../../api/adminService";

export default function AdminProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getAdminProfile().then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>👤 Hồ sơ Admin</h2>

      <div style={card}>
        <div style={{ marginBottom: 12 }}>
          <strong>Email:</strong>
          <div>{profile.email}</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Họ tên:</strong>
          <div>{profile.fullName}</div>
        </div>

        <div>
          <strong>Vai trò:</strong>
          <div>ADMIN</div>
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 20,
  background: "#fff",
};
