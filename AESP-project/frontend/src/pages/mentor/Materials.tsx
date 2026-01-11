import { useEffect, useState } from "react";
import { getMaterials, uploadMaterial } from "../../api/mentorService";
import type { LearningMaterial } from "../../types/mentor";

export default function Materials() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    getMaterials().then(res => setMaterials(res.data));
  };

  const upload = async () => {
    if (!file || !title) {
      alert("Enter title & choose file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    await uploadMaterial(formData);

    setTitle("");
    setFile(null);
    loadMaterials();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 800 }}>
        <h1 style={{ fontSize: 24, marginBottom: 20 }}>
          Kho tài liệu
        </h1>

        {/* UPLOAD FORM */}
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            marginBottom: 24,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>
            Tải tài liệu mới lên
          </h3>

          {/* TITLE */}
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 12,
              border: "1px solid #d1d5db",
              borderRadius: 4,
              boxSizing: "border-box",
            }}
          />

          {/* FILE PICKER */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              border: "1px dashed #94a3b8",
              borderRadius: 6,
              cursor: "pointer",
              background: "#f8fafc",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                color: file ? "#0f172a" : "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "70%",
              }}
            >
              {file
                ? file.name
                : "Chọn tệp (PDF, DOCX, MP3...)"}
            </span>

            <span
              style={{
                padding: "6px 12px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: 4,
                fontSize: 13,
              }}
            >
              Browse
            </span>

            <input
              type="file"
              hidden
              onChange={e =>
                setFile(e.target.files?.[0] || null)
              }
            />
          </label>

          {/* UPLOAD BUTTON */}
          <button
            onClick={upload}
            style={{
              padding: "8px 16px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Upload
          </button>
        </div>
{/* MATERIAL LIST */}
<div
  style={{
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  }}
>
  <h3 style={{ marginBottom: 16 }}>
    Tài liệu đã tải lên
  </h3>

  {materials.length === 0 ? (
    <div style={{ color: "#64748b" }}>
      Chưa có tài liệu nào
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {materials.map(m => (
        <div
          key={m.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            background: "#f8fafc",
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: 20,
              }}
            >
              📄
            </div>

            <div
              style={{
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 360,
                }}
              >
                {m.title}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                Uploaded file
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <a
            href={m.fileUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "6px 12px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 4,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Open
          </a>
        </div>
      ))}
    </div>
  )}
</div>
        </div>
    </div>
  );
}
