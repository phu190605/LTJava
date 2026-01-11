import { useEffect, useState } from "react";
import { getDashboard } from "../../api/mentorService";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboard("mentor01").then(res => setData(res.data));
  }, []);

  if (!data) return null;

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <StatCard title="Pending Feedbacks" value={data.pendingFeedbacks} />
        <StatCard title="Active Learners" value={data.activeLearners} />
      </div>
    </div>
  );
}