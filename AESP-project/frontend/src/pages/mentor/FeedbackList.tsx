import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingExercises } from "../../api/mentorApi";
import { getMentorId } from "../../utils/auth";
import {
  Card,
  Table,
  Typography,
  Tag,
  Button,
  Input,
  Space,
  Row,
  Col,
  Statistic
} from "antd";
import {
  AudioOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const formatDateTime = (record: any) => {
  const rawTime =
    record.createdAt ||
    record.submittedAt ||
    record.created_at ||
    record.submitTime;

  if (!rawTime) return "Không xác định";

  const date = new Date(rawTime);

  if (isNaN(date.getTime())) return "Không xác định";

  return date.toLocaleString("vi-VN");
};

export default function FeedbackList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPendingExercises()
      .then(res => setData(res || []))
      .finally(() => setLoading(false));
  }, []);


  const columns = [
    {
      title: "HỌC VIÊN",
      render: (_: any, r: any) => (
        <div>
          <Text strong>
            {r.learnerName || `ID: ${r.learnerId}`}
          </Text>
          <br />
          <Text type="secondary">ID: {r.learnerId}</Text>
        </div>
      )
    },
    {
      title: "LOẠI BÀI TẬP",
      render: () => (
        <Space>
          <AudioOutlined />
          Luyện tập phát âm
        </Space>
      )
    },
    {
      title: "THỜI GIAN NỘP",
      render: (_: any, r: any) => formatDateTime(r)
    },
    {
      title: "TRẠNG THÁI",
      render: () => <Tag color="orange">Chờ chấm</Tag>
    },
    {
      title: "HÀNH ĐỘNG",
      render: (_: any, r: any) => (
        <Button
          type="primary"
          onClick={() => navigate(`/mentor/feedback/${r.id}`)}
        >
          Chấm bài
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>✍️ Danh sách bài tập chờ chấm</Title>

      {/* SEARCH BAR */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm học viên..."
          style={{ width: 260 }}
        />
        <Button>Bộ lọc</Button>
      </div>

      {/* TABLE */}
      <Card style={{ borderRadius: 16 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 4 }}
        />
      </Card>
    </div>
  );
}
