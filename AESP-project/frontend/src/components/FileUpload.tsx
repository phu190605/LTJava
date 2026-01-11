import { useState } from "react";
import { uploadMaterial } from "../api/mentorService";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    form.append("mentorId", "mentor01");
    form.append("level", "B1");
    form.append("category", "Grammar");

    await uploadMaterial(form);
    alert("Upload success!");
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>Upload Material</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        style={{
          marginLeft: 8,
          padding: "6px 12px",
          background: "#0ea5e9",
          color: "#fff",
          border: "none",
          borderRadius: 4,
        }}
      >
        Upload
      </button>
    </div>
  );
}
