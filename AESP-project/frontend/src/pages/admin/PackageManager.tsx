import { useEffect, useState } from "react";
import {
  getAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  deleteAdminPackage,
} from "../../api/adminPackageApi";

/* ================= TYPE ================= */

type Package = {
  packageId?: number;
  packageName: string;
  price: number;
  durationMonths: number;
  description: string;
  features: string;
  hasMentor: boolean;
};

const emptyPackage: Package = {
  packageName: "",
  price: 0,
  durationMonths: 1,
  description: "",
  features: "",
  hasMentor: false,
};

/* ================= PAGE ================= */

export default function PackageManager() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [newPkg, setNewPkg] = useState<Package>(emptyPackage);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    const res = await getAdminPackages();
    setPackages(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= CRUD ================= */

  const create = async () => {
    if (!newPkg.packageName.trim()) {
      alert("Nhập tên gói");
      return;
    }
    await createAdminPackage(newPkg);
    setNewPkg(emptyPackage);
    setShowCreate(false);
    load();
  };

  const update = async (pkg: Package) => {
    if (!pkg.packageId) return;
    await updateAdminPackage(pkg.packageId, pkg);
    alert("Đã cập nhật gói");
    load();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Xóa gói này?")) return;
    await deleteAdminPackage(id);
    load();
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={title}>📦 Quản lý gói dịch vụ</h2>
        <button style={addBtn} onClick={() => setShowCreate((v) => !v)}>
          ➕ Thêm gói
        </button>
      </div>

      {/* CREATE FORM */}
      {showCreate && (
        <div style={{ ...card, marginBottom: 30 }}>
          <h3>➕ Thêm gói mới</h3>

          <div style={formGrid}>
            <Input
              label="Tên gói"
              value={newPkg.packageName}
              onChange={(v) =>
                setNewPkg({ ...newPkg, packageName: v })
              }
            />

            <Input
              label="Giá"
              type="number"
              value={newPkg.price}
              onChange={(v) =>
                setNewPkg({ ...newPkg, price: Number(v) })
              }
            />

            <Input
              label="Thời hạn (tháng)"
              type="number"
              value={newPkg.durationMonths}
              onChange={(v) =>
                setNewPkg({ ...newPkg, durationMonths: Number(v) })
              }
            />

            <TextArea
              label="Mô tả"
              value={newPkg.description}
              onChange={(v) =>
                setNewPkg({ ...newPkg, description: v })
              }
            />

            <TextArea
              label="Features"
              value={newPkg.features}
              onChange={(v) =>
                setNewPkg({ ...newPkg, features: v })
              }
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button style={saveBtn} onClick={create}>
              Lưu gói
            </button>

            <button
              style={cancelBtn}
              onClick={() => {
                setShowCreate(false);
                setNewPkg(emptyPackage);
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* LIST PACKAGES */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {packages.map((p) => (
          <div key={p.packageId} style={card}>
            <div style={cardHeader}>
              <input
                style={{ ...input, fontWeight: 600 }}
                value={p.packageName}
                onChange={(e) =>
                  setPackages((prev) =>
                    prev.map((x) =>
                      x.packageId === p.packageId
                        ? { ...x, packageName: e.target.value }
                        : x
                    )
                  )
                }
              />

              <div style={{ display: "flex", gap: 8 }}>
                <button style={saveBtn} onClick={() => update(p)}>
                  Lưu
                </button>
                <button
                  style={deleteBtn}
                  onClick={() => remove(p.packageId)}
                >
                  Xóa
                </button>
              </div>
            </div>

            <div style={formGrid}>
              <Input
                label="Giá"
                value={p.price}
                onChange={(v) =>
                  setPackages((prev) =>
                    prev.map((x) =>
                      x.packageId === p.packageId
                        ? { ...x, price: Number(v) }
                        : x
                    )
                  )
                }
              />

              <Input
                label="Thời hạn (tháng)"
                value={p.durationMonths}
                onChange={(v) =>
                  setPackages((prev) =>
                    prev.map((x) =>
                      x.packageId === p.packageId
                        ? { ...x, durationMonths: Number(v) }
                        : x
                    )
                  )
                }
              />

              <TextArea
                label="Mô tả"
                value={p.description}
                onChange={(v) =>
                  setPackages((prev) =>
                    prev.map((x) =>
                      x.packageId === p.packageId
                        ? { ...x, description: v }
                        : x
                    )
                  )
                }
              />

              <TextArea
                label="Features"
                value={p.features}
                onChange={(v) =>
                  setPackages((prev) =>
                    prev.map((x) =>
                      x.packageId === p.packageId
                        ? { ...x, features: v }
                        : x
                    )
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: any;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        style={input}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        style={textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ================= STYLE ================= */

const title: React.CSSProperties = { marginBottom: 0 };

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  padding: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
};

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#475569",
  marginBottom: 4,
  display: "block",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};

const textarea: React.CSSProperties = {
  ...input,
  minHeight: 80,
  resize: "vertical",
};

const saveBtn: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const addBtn: React.CSSProperties = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const cancelBtn: React.CSSProperties = {
  background: "#e5e7eb",
  color: "#334155",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};
