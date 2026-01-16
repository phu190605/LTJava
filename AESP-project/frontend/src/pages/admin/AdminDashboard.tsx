import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "../../css/admin-dashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    mentors: 0,
    skills: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = (await axiosClient.get("/admin/users")) as any[];
        const mentors = (await axiosClient.get("/admin/mentors")) as any[];
        const skills = (await axiosClient.get("/admin/skills")) as any[];

        setStats({
          users: users.length,
          mentors: mentors.length,
          skills: skills.length,
        });
      } catch (e) {
        console.error(e);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>

      <div className="dashboard-grid">
        <DashboardCard title="Users" value={stats.users} />
        <DashboardCard title="Mentors" value={stats.mentors} />
        <DashboardCard title="Skills" value={stats.skills} />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
