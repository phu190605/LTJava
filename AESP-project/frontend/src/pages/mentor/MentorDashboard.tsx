import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  List,
  Tag,
  Button,
  Empty,
} from "antd";
import {
  FileTextOutlined,
  CustomerServiceOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getPendingAssessments,
  getPendingExercises,
  getMentorProfile,
} from "../../api/mentorApi";
import { getMentorId } from "../../utils/auth";

export default function MentorDashboard() {
  const mentorId = getMentorId();
  const navigate = useNavigate();

  const [mentorName, setMentorName] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const [pendingAssessments, setPendingAssessments] = useState<any[]>([]);
  const [pendingExercises, setPendingExercises] = useState<any[]>([]);

  useEffect(() => {
    if (!mentorId) return;

    (async () => {
      try {
        // 🔹 LẤY TÊN MENTOR
        const profileRes = await getMentorProfile(mentorId);
        setMentorName(profileRes.data?.fullName || "");

        // 🔹 STATS (dùng cho feedback đã gửi)
        const s = await getDashboardStats(mentorId);
        setStats(s.data);

        // 🔹 DATA THỰC TẾ
        const a = await getPendingAssessments(mentorId);
        setPendingAssessments(a.data || []);

        const e = await getPendingExercises(mentorId);
        setPendingExercises(e.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [mentorId]);

  // 🔹 SỐ HỌC VIÊN PHỤ TRÁCH (tính từ bài chờ chấm)
  const studentCount =
    pendingExercises.length > 0
      ? new Set(pendingExercises.map(e => e.learnerId)).size
      : stats?.studentCount ?? 0;

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

  const sectionHeader = (title: string, icon: React.ReactNode) => (
    <div
      style={{
        background: "#f8fafc",
        padding: "12px 20px",
        fontWeight: 600,
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {icon} {title}
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>
          👋 Xin chào{mentorName ? `, ${mentorName}` : ""}!
        </h2>
        <p style={{ color: "#6b7280" }}>
          Đây là bảng điều khiển cho mọi hoạt động của bạn 🤝
        </p>
      </div>

      {/* STATS */}
      <Row gutter={16}>
        <Col span={6}>
          {stat(
            "Chờ xếp lớp",
            pendingAssessments.length,
            <FileTextOutlined />,
            "#eef2ff",
            "#4f46e5"
          )}
        </Col>
        <Col span={6}>
          {stat(
            "Bài chờ chấm",
            pendingExercises.length,
            <CustomerServiceOutlined />,
            "#fff7ed",
            "#f97316"
          )}
        </Col>
        <Col span={6}>
          {stat(
            "Feedback đã gửi",
            stats?.completedFeedback ?? 0,
            <CheckCircleOutlined />,
            "#ecfdf5",
            "#22c55e"
          )}
        </Col>
        <Col span={6}>
          {stat(
            "Học viên phụ trách",
            studentCount,
            <TeamOutlined />,
            "#f5f3ff",
            "#8b5cf6"
          )}
        </Col>
      </Row>

      {/* ASSESSMENTS */}
      <Card style={{ marginTop: 24, borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
        {sectionHeader("Bài test đầu vào cần xếp lớp", <FileTextOutlined />)}
        <div style={{ padding: 32 }}>
          {pendingAssessments.length === 0 ? (
            <Empty description="Hiện không có bài test nào cần xử lý" />
          ) : (
            <List
              dataSource={pendingAssessments}
              renderItem={(item) => (
                <List.Item>
                  <b>{item.learnerId}</b>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate(`/mentor/assessment/${item.id}`)
                    }
                  >
                    Chấm bài
                  </Button>
                </List.Item>
              )}
            />
          )}
        </div>
      </Card>

      {/* EXERCISES */}
      <Card style={{ marginTop: 24, borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
        {sectionHeader("Bài luyện tập cần feedback", <CustomerServiceOutlined />)}
        <div style={{ padding: 32 }}>
          {pendingExercises.length === 0 ? (
            <Empty description="Mọi phản hồi đều đã được hoàn thành!" />
          ) : (
            <List
              dataSource={pendingExercises}
              renderItem={(item) => (
                <List.Item>
                  <Tag color="cyan">Waiting</Tag>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate(`/mentor/feedback/${item.id}`)
                    }
                  >
                    Feedback →
                  </Button>
                </List.Item>
              )}
            />
          )}
        </div>
      </Card>

      {/* NEW FEATURE */}
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
          <Button type="link">Xem chi tiết</Button>
        </div>
      </Card>
    </div>
  );
}
