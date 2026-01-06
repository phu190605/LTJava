import { useEffect, useState } from "react";
import {
    createMentor,
    getAllMentors,
    getAllSkills,
    assignSkillsToMentor,
} from "../api/mentorApi";

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
        try {
            const res = await getAllMentors();
            setMentors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSkills = async () => {
        try {
            const res = await getAllSkills();
            setSkills(res.data);
        } catch {
            setSkills([]);
        }
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
        alert("Gán skill thành công");
        setSelectedMentor(null);
        setSelectedSkills([]);
        fetchMentors();
    };

    return (
        <div style={pageStyle}>
            <h2 style={title}>🎓 Quản lý Mentor</h2>

            {/* CREATE */}
            <div style={card}>
                <h3 style={cardTitle}>➕ Tạo Mentor</h3>
                <div style={formRow}>
                    <input style={input} placeholder="Họ tên" value={fullName} onChange={e => setFullName(e.target.value)} />
                    <input style={input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input style={input} placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
                    <button style={primaryBtn} onClick={handleCreateMentor}>Tạo</button>
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
                        {mentors.map(m => (
                            <tr key={m.id}>
                                <td style={td}>{m.id}</td>
                                <td style={td}>{m.fullName}</td>
                                <td style={td}>{m.email}</td>
                                <td style={td}>
                                    {m.skills?.length
                                        ? m.skills.map(s => s.name).join(", ")
                                        : <span style={{ color: "#999" }}>Chưa có</span>}
                                </td>
                                <td style={td}>
                                    <button style={outlineBtn} onClick={() => setSelectedMentor(m)}>
                                        Gán skill
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
                        <h3>Gán skill cho <b>{selectedMentor.fullName}</b></h3>

                        <div style={{ marginTop: 12 }}>
                            {skills.map(s => (
                                <label key={s.id} style={checkboxRow}>
                                    <input
                                        type="checkbox"
                                        value={s.name}
                                        checked={selectedSkills.includes(s.name)}
                                        onChange={e => {
                                            const v = e.target.value;
                                            setSelectedSkills(prev =>
                                                prev.includes(v)
                                                    ? prev.filter(x => x !== v)
                                                    : [...prev, v]
                                            );
                                        }}
                                    />
                                    {s.name}
                                </label>
                            ))}
                        </div>

                        <div style={{ marginTop: 16, textAlign: "right" }}>
                            <button style={primaryBtn} onClick={handleAssignSkills}>Lưu</button>
                            <button style={cancelBtn} onClick={() => setSelectedMentor(null)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ========== STYLE ========== */

const pageStyle = {
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

const formRow = {
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
};

const th = {
    border: "1px solid #ddd",
    padding: 10,
    background: "#f0f2f5",
    textAlign: "left" as const,
};

const td = {
    border: "1px solid #ddd",
    padding: 10,
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

const checkboxRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
};
