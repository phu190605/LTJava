interface StatCardProps {
  title: string;
  value: number | string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: 16,
        borderRadius: 8,
        minWidth: 180,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ fontSize: 14, color: "#64748b" }}>{title}</p>
      <h2 style={{ fontSize: 28, marginTop: 8 }}>{value}</h2>
    </div>
  );
}
