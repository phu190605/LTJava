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

    {/* To-do list */}
    <h3>To-do</h3>
    <div style={{ display: "flex", gap: 20 }}>
      <StatCard
        title="Pending Assessments"
        value={data.todo.pendingAssessments}
      />
      <StatCard
        title="Pending Feedbacks"
        value={data.todo.pendingFeedbacks}
      />
    </div>

    {/* Stats */}
    <h3 style={{ marginTop: 30 }}>Statistics</h3>
    <div style={{ display: "flex", gap: 20 }}>
      <StatCard
        title="Active Learners"
        value={data.stats.activeLearners}
      />
      <StatCard
        title="Sessions This Week"
        value={data.stats.sessionsThisWeek}
      />
      <StatCard
        title="Feedbacks This Week"
        value={data.stats.feedbacksThisWeek}
      />
    </div>
  </div>
);

}