import { useEffect, useState } from "react";
import { getAssessmentDetail, submitAssessmentLevel } from "../../api/mentorApi";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Select, Input, Button, Typography, message, Card } from "antd";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AssessmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [level, setLevel] = useState<string>("A1");
  const [comment, setComment] = useState("");

  const loadDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getAssessmentDetail(id);
      setData(res.data);
    } catch (err) {
      message.error("Lỗi tải dữ liệu bài test");
      console.error(err);
    }
    setLoading(false);
  };

  const submit = async () => {
    if (!id) return;
    if (!level) return message.warning("Hãy chọn level");

    setSaving(true);
    try {
      await submitAssessmentLevel(id, level, comment);
      message.success("Đã xếp lớp thành công 🎉");
      navigate("/mentor/assessment");
    } catch (err) {
      message.error("Không thể lưu kết quả");
      console.error(err);
    }
    setSaving(false);
  };

  useEffect(() => {
    loadDetail();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <Title level={2}>🎯 Chấm bài test đầu vào</Title>
      <Card style={{ borderRadius: 12, padding: 20 }}>

        <Text strong>👤 Học viên: </Text>
        <Text>{data.learnerId}</Text>
        <br />

        <Text strong>🤖 Điểm AI gợi ý: </Text>
        <Text>{data.aiScore ?? "--"}</Text>
        <br />

        <Text strong>🕛 Gửi lúc: </Text>
        <Text>
          {new Date(data.createdAt).toLocaleString("vi-VN")}
        </Text>

        <Title level={4} style={{ marginTop: 24 }}>📜 Transcript</Title>
        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
          {data.transcript || "(Không có transcript)"}
        </Paragraph>

        <Title level={4} style={{ marginTop: 24 }}>🎓 Chọn Level (A1 → C2)</Title>
        <Select
          value={level}
          onChange={setLevel}
          style={{ width: 200 }}
          options={[
            { value: "A1", label: "A1" },
            { value: "A2", label: "A2" },
            { value: "B1", label: "B1" },
            { value: "B2", label: "B2" },
            { value: "C1", label: "C1" },
            { value: "C2", label: "C2" },
          ]}
        />

        <Title level={4} style={{ marginTop: 24 }}>✍ Nhận xét</Title>
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhận xét cho học viên (không bắt buộc)"
        />

        <Button
          type="primary"
          size="large"
          onClick={submit}
          loading={saving}
          style={{ marginTop: 24, borderRadius: 8 }}
        >
          Lưu & Xếp lớp
        </Button>

        <Button
          size="large"
          style={{ marginTop: 12, marginLeft: 12 }}
          onClick={() => navigate("/mentor/assessment")}
        >
          ⬅ Quay lại danh sách
        </Button>

      </Card>
    </div>
  );
}
