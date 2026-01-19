import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getExerciseDetail,
  submitExerciseFeedback
} from "../../api/mentorApi";
import {
  Card,
  Spin,
  Typography,
  Button,
  Input,
  Select,
  message,
  Row,
  Col,
  Tag
} from "antd";
import {
  ArrowLeftOutlined,
  AudioOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// ✅ FORMAT THỜI GIAN AN TOÀN
const formatSubmitTime = (data: any) => {
  const rawTime =
    data?.submittedAt ||
    data?.createdAt ||
    data?.created_at ||
    data?.submitTime;

  if (!rawTime) return "Không xác định";

  const date = new Date(rawTime);
  if (isNaN(date.getTime())) return "Không xác định";

  return date.toLocaleString("vi-VN");
};

export default function FeedbackEditor() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [mistake, setMistake] = useState("");
  const [correction, setCorrection] = useState("");
  const [tag, setTag] = useState("");
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    getExerciseDetail(sessionId)
      .then(res => setData(res.data))
      .catch(() => message.error("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const submit = async () => {
    if (!mistake || !correction || !tag) {
      return message.warning("Nhập đầy đủ thông tin");
    }

    await submitExerciseFeedback(sessionId!, mistake, correction, tag, time);
    message.success("Đã gửi feedback!");
    navigate("/mentor/feedback");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Title level={3}>🎧 Chấm bài luyện tập</Title>

      <Row gutter={24}>
        {/* LEFT */}
        <Col span={16}>
          <Card style={{ borderRadius: 16, marginBottom: 16 }}>
            <Text strong>👤 Học viên:</Text> {data.learnerId}
            <br />
            <Text strong>🕒 Thời gian nộp:</Text>{" "}
            {formatSubmitTime(data)}
            <br />
            <Tag color="orange" style={{ marginTop: 8 }}>
              PENDING
            </Tag>
          </Card>

          <Card style={{ borderRadius: 16, marginBottom: 16 }}>
            <Text strong>
              <AudioOutlined /> Bản thu âm
            </Text>
            <audio
              controls
              src={data.audioUrl}
              style={{ width: "100%", marginTop: 12 }}
            />
          </Card>

          <Card style={{ borderRadius: 16 }}>
            <Text strong>Transcript</Text>
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#f9fafb",
                borderRadius: 8,
                fontStyle: "italic"
              }}
            >
              {data.transcript || "(Chưa có transcript cho bài tập này)"}
            </div>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col span={8}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={5}>✍ Nhận xét & Feedback</Title>

            <Text strong>Lỗi phát hiện</Text>
            <TextArea
              rows={2}
              value={mistake}
              onChange={e => setMistake(e.target.value)}
              placeholder="Nhập lỗi..."
            />

            <Text strong style={{ marginTop: 12, display: "block" }}>
              Gợi ý sửa
            </Text>
            <TextArea
              rows={2}
              value={correction}
              onChange={e => setCorrection(e.target.value)}
              placeholder="Gợi ý sửa chuẩn..."
            />

            <Text strong style={{ marginTop: 12, display: "block" }}>
              Loại lỗi
            </Text>
            <Select
              value={tag || undefined}
              onChange={setTag}
              style={{ width: "100%" }}
            >
              <Select.Option value="grammar">Grammar</Select.Option>
              <Select.Option value="pronunciation">Pronunciation</Select.Option>
              <Select.Option value="vocab">Vocabulary</Select.Option>
              <Select.Option value="general">General</Select.Option>
            </Select>

            <Text strong style={{ marginTop: 12, display: "block" }}>
              Thời điểm (giây)
            </Text>
            <Input
              type="number"
              value={time}
              min={0}
              onChange={e => setTime(Number(e.target.value))}
            />

            <Button
              type="primary"
              block
              style={{ marginTop: 20 }}
              onClick={submit}
            >
              🚀 Gửi Feedback & Hoàn tất
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
