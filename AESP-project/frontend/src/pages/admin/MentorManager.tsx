import { useEffect, useState } from "react";
import {
  createMentor,
  getAllMentors,
  getAllSkills,
  assignSkillsToMentor,
  deleteMentor,
  removeSkillFromMentor,
} from "../../api/mentorApi";

interface Skill {
  id: number;
  name: string;
}

interface Mentor {
  id: number;
  fullName: string;
  email: string;
  skills?: Skill[];
}

export default function MentorManager() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const fetchMentors = async () => {
    const res = (await getAllMentors()) as Mentor[];
    setMentors(res);
  };

  const fetchSkills = async () => {
    const res = (await getAllSkills()) as Skill[];
    setSkills(res);
  };

  useEffect(() => {
    fetchMentors();
    fetchSkills();
  }, []);

  const handleCreateMentor = async () => {
    if (!fullName || !email || !password) {
      alert("Nhập đủ thông tin");
      return;
    }
    await createMentor({ fullName, email, password });
    setFullName("");
    setEmail("");
    setPassword("");
    fetchMentors();
  };

  const handleAssignSkills = async () => {
    if (!selectedMentor) return;
    await assignSkillsToMentor(selectedMentor.id, selectedSkills);
    setSelectedMentor(null);
    setSelectedSkills([]);
    fetchMentors();
  };

  const handleDeleteMentor = async (id: number) => {
    if (!window.confirm("Xóa mentor này vĩnh viễn?")) return;
    await deleteMentor(id);
    fetchMentors();
  };

  const handleRemoveSkill = async (mentorId: number, skillId: number) => {
    await removeSkillFromMentor(mentorId, skillId);
    fetchMentors();
  };

  return (
    <div style={page}>
      <h2 style={title}>🎓 Quản lý Mentor</h2>

      {/* CREATE */}
      <div style={card}>
        <h3 style={cardTitle}>➕ Tạo Mentor</h3>
        <div style={row}>
          <input
            style={input}
            placeholder="Họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            style={input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={input}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={primaryBtn} onClick={handleCreateMentor}>
            Tạo
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={card}>
        <h3 style={cardTitle}>📋 Danh sách Mentor</h3>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Tên</th>
              <th style={th}>Email</th>
              <th style={th}>Skills</th>
              <th style={th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((m) => (
              <tr
                key={m.id}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                <td style={td}>{m.id}</td>
                <td style={td}>{m.fullName}</td>
                <td style={td}>{m.email}</td>
                <td style={td}>
                  {m.skills?.length ? (
                    m.skills.map((s) => (
                      <span key={s.id} style={skillChip}>
                        {s.name}
                        <button
                          style={removeSkillBtn}
                          onClick={() =>
                            handleRemoveSkill(m.id, s.id)
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#999" }}>Chưa có</span>
                  )}
                </td>
                <td style={td}>
                  <button
                    style={outlineBtn}
                    onClick={() => setSelectedMentor(m)}
                  >
                    Gán skill
                  </button>
                  <button
                    style={dangerBtn}
                    onClick={() => handleDeleteMentor(m.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedMentor && (
        <div style={overlay}>
          <div style={modal}>
            <h3>
              Gán skill cho <b>{selectedMentor.fullName}</b>
            </h3>

            <div style={{ marginTop: 12 }}>
              {skills.map((s) => (
                <label key={s.id} style={checkbox}>
                  <input
                    type="checkbox"
                    value={s.name}
                    checked={selectedSkills.includes(s.name)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSelectedSkills((prev) =>
                        prev.includes(v)
                          ? prev.filter((x) => x !== v)
                          : [...prev, v]
                      );
                    }}
                  />
                  {s.name}
                </label>
              ))}
            </div>

            <div style={{ textAlign: "right", marginTop: 16 }}>
              <button style={primaryBtn} onClick={handleAssignSkills}>
                Lưu
              </button>
              <button
                style={cancelBtn}
                onClick={() => setSelectedMentor(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLE (GIỮ NGUYÊN) ================= */

const page = {
  padding: 32,
  background: "#f4f6f8",
  minHeight: "100vh",
};

const title = {
  marginBottom: 24,
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  marginBottom: 24,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const cardTitle = {
  marginBottom: 12,
};

const row = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
};

const input = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  minWidth: 180,
};

const primaryBtn = {
  background: "#1677ff",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
};

const outlineBtn = {
  background: "#fff",
  color: "#1677ff",
  border: "1px solid #1677ff",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};

const dangerBtn = {
  marginLeft: 8,
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};

const cancelBtn = {
  marginLeft: 8,
  background: "#ddd",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginTop: 12,
};

const th = {
  border: "1px solid #e5e7eb",
  padding: "12px 10px",
  background: "#f9fafb",
  textAlign: "left" as const,
  fontWeight: 600,
};

const td = {
  border: "1px solid #e5e7eb",
  padding: "10px",
  verticalAlign: "middle" as const,
};

const skillChip = {
  display: "inline-flex",
  alignItems: "center",
  background: "#eef2ff",
  padding: "4px 8px",
  borderRadius: 6,
  marginRight: 6,
  marginBottom: 6,
};

const removeSkillBtn = {
  border: "none",
  background: "transparent",
  color: "red",
  marginLeft: 6,
  cursor: "pointer",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 10,
  minWidth: 320,
};

const checkbox = {
  display: "block",
  marginBottom: 6,
};
