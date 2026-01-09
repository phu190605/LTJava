import { useState, useEffect } from "react";
import { getAllMaterials, uploadMaterial } from "../../api/mentorApi";
import type { LearningMaterial } from "../../types/mentor";
import "../../css/mentor.css";
import { getMentorId } from "../../utils/auth";

export default function Materials() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const mentorId = getMentorId();

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const res = await getAllMaterials();
    setMaterials(res.data);
  };

  const handleUpload = async () => {
    if (!mentorId) {
      alert("Không xác định mentor");
      return;
    }

    if (!file || !title) {
      alert("Vui lòng nhập tiêu đề và chọn file");
      return;
    }

    await uploadMaterial(file, title, mentorId);
    alert("Upload thành công!");

    setFile(null);
    setTitle("");
    loadMaterials();
  };

  return (
    <div className="mentor-card">
      <h2>📚 Kho tài liệu</h2>

      <input
        className="mentor-input"
        type="text"
        placeholder="Tiêu đề tài liệu"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <div style={{ margin: "10px 0" }}>
        <input
          id="file-upload"
          type="file"
          className="file-input"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="file-upload" className="file-label">
          📁 Chọn tệp
        </label>

        {file && <span style={{ marginLeft: 10 }}>{file.name}</span>}
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        ⬆ Upload
      </button>

      <ul className="material-list">
        {materials.map(m => (
          <li key={m.id}>
            <strong>{m.title}</strong> ({m.type}) –{" "}
            <a href={m.fileUrl} target="_blank" rel="noreferrer">
              Xem
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
