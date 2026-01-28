import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
} from "antd";
import {
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import MentorPlacementPanel from "./MentorPlacementPanel";
import { getDashboardStats, getMentorProfile } from "../../api/mentorApi";

export default function MentorDashboard() {
  const navigate = useNavigate();

  const [mentorName, setMentorName] = useState("");

  const [stats, setStats] = useState<{
    pendingSessions: number;
    completedFeedback: number;
    studentCount: number;
    totalMaterials: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getMentorProfile();
        setMentorName(profile?.fullName || "");

        const dashboard = await getDashboardStats();
        setStats(dashboard);
      } catch (err) {
        console.error("Load mentor dashboard failed", err);
      }
    })();
  }, []);

  const stat = (
    title: string,
    value: number,
    icon: React.ReactNode,
    bg: string,
    color: string
  ) => (
    <Card style={{ borderRadius: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: bg,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>
            {value}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>
          👋 Xin chào{mentorName ? `, ${mentorName}` : ""}!
        </h2>
        <p style={{ color: "#6b7280" }}>
          Đây là bảng điều khiển cho mọi hoạt động của bạn 🤝
        </p>
      </div>

      <Row gutter={16}>
        <Col span={6}>
          {stat(
            "Chờ xếp lớp",
            stats?.pendingSessions ?? 0,
            <FileTextOutlined />,
            "#eef2ff",
            "#4f46e5"
          )}
        </Col>

        <Col span={6}>
          {stat(
            "Học viên phụ trách",
            stats?.studentCount ?? 0,
            <TeamOutlined />,
            "#f5f3ff",
            "#8b5cf6"
          )}
        </Col>
      </Row>

      <MentorPlacementPanel />

      <Card
        style={{
          marginTop: 24,
          borderRadius: 16,
          background: "#eff6ff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <b>🔔 Tính năng mới</b>
            <p style={{ color: "#2563eb", marginTop: 4 }}>
              Theo dõi tiến độ học viên trực quan hơn với biểu đồ thống kê mới.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
