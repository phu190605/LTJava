import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/mentorService";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    getProfile("mentor01").then(res => setProfile(res.data));
  }, []);

  const save = () => updateProfile(profile);

  return (
<div
  style={{
    display: "flex",
    justifyContent: "center",
  }}
>
  <div style={{ width: "100%", maxWidth: 500 }}>
    <h1
      style={{
        fontSize: 24,
        marginBottom: 24,
        textAlign: "center",
      }}
    >
      My Profile
    </h1>

    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Full Name
        </label>
        <input
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
          }}
          value={profile.fullName || ""}
          onChange={e =>
            setProfile({ ...profile, fullName: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Bio
        </label>
        <textarea
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #d1d5db",
            minHeight: 80,
            boxSizing: "border-box",
          }}
          value={profile.bio || ""}
          onChange={e =>
            setProfile({ ...profile, bio: e.target.value })
          }
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={save}
          style={{
            padding: "8px 24px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
