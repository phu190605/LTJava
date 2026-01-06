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
                const [users, mentors, skills] = await Promise.all([
                    axiosClient.get("/admin/users"),
                    axiosClient.get("/admin/mentors"),
                    axiosClient.get("/admin/skills"),
                ]);

                setStats({
                    users: users.data.length,
                    mentors: mentors.data.length,
                    skills: skills.data.length,
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
