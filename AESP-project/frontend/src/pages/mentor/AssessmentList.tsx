import { useEffect, useState } from "react";
import { getPendingAssessments } from "../../api/mentorApi";
import { getMentorId } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Card, Typography, Button, Tag } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function AssessmentList() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const mentorId = getMentorId();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!mentorId) return;
    setLoading(true);
    try {
      const res = await getPendingAssessments(mentorId);
      setData(res.data);
    } catch (err) {
      console.error("Assessment list error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
      <Title level={2}>🎤 Bài test đầu vào chờ xếp lớp</Title>
      <Paragraph>
        Đây là các bài đánh giá đầu vào học viên đã gửi.
        Hãy chấm và gán cấp độ phù hợp (A1 → C2). 💡
      </Paragraph>

      {loading && (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && data.length === 0 && (
        <Empty description="Không có bài nào" style={{ marginTop: 50 }} />
      )}

      {!loading &&
        data.map((a) => (
          <Card
            key={a.id}
            style={{
              marginBottom: 16,
              borderRadius: 10,
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Text strong>👤 Học viên:</Text> <Text>{a.learnerId}</Text>
                <br />

                <Text strong>📌 Trạng thái:</Text> <Tag color="orange">PENDING</Tag>
                <br />

                <Text strong>🤖 AI Score:</Text>{" "}
                <Text>{a.aiScore ?? "--"}</Text>
                <br />

                <Text strong>🕛 Gửi lúc:</Text>{" "}
                <Text>
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleString("vi-VN")
                    : "Không rõ"}
                </Text>

                <br />
                <Text strong>📝 Tóm tắt transcript:</Text>
                <Paragraph style={{ marginTop: 4 }}>
                  {a.transcript
                    ? a.transcript.slice(0, 120) + "..."
                    : "(Không có transcript)"}
                </Paragraph>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  style={{ borderRadius: 8 }}
                  onClick={() => navigate(`/mentor/assessment/${a.id}`)}
                >
                  🎯 Chấm & Xếp lớp
                </Button>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}
