import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Upload,
  Table,
  message,
  Tag,
  Space,
  Row,
  Col
} from "antd";
import {
  UploadOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  SearchOutlined,
  CloudUploadOutlined
} from "@ant-design/icons";
import {
  getAllMaterials,
  uploadMaterial,
  getMentorProfile
} from "../../api/mentorApi";
import { getMentorId } from "../../utils/auth";

const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function Materials() {
  const mentorId = getMentorId();

  const [materials, setMaterials] = useState<any[]>([]);
  const [mentorName, setMentorName] = useState<string>("Mentor");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const fetchMaterials = async () => {
    if (!mentorId) return;

    setLoading(true);
    try {
      const profile = await getMentorProfile();
      const name = profile?.fullName || "Mentor";
      setMentorName(name);

      const list = await getAllMaterials();

      const mapped = list.map((m: any) => ({
        ...m,
        mentorName:
          String(m.mentorId) === String(mentorId)
            ? name
            : m.mentorName || "Mentor"
      }));

      setMaterials(mapped);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách tài liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const onUpload = async () => {
    if (!file || !title) {
      return message.warning("Vui lòng nhập tiêu đề và chọn file");
    }

    try {
      message.loading({ content: "Đang tải tài liệu...", key: "upload" });
      await uploadMaterial(file, title, mentorId!);
      message.success({ content: "Tải tài liệu thành công 🎉", key: "upload" });
      setFile(null);
      setTitle("");
      fetchMaterials();
    } catch {
      message.error("Upload thất bại");
    }
  };

  const getFileIcon = (type: string) => {
    if (type?.includes("pdf")) return <FilePdfOutlined style={{ color: "#ef4444" }} />;
    if (type?.includes("doc")) return <FileWordOutlined style={{ color: "#2563eb" }} />;
    if (type?.includes("xls")) return <FileExcelOutlined style={{ color: "#16a34a" }} />;
    return <CloudUploadOutlined />;
  };

  const columns = [
    {
      title: "TIÊU ĐỀ",
      dataIndex: "title",
      render: (t: string) => <Text strong>{t}</Text>
    },
    {
      title: "LOẠI",
      dataIndex: "type",
      render: (t: string) => (
        <Space>
          {getFileIcon(t)}
          <Tag>{t?.toUpperCase()}</Tag>
        </Space>
      )
    },
    {
      title: "FILE",
      render: (r: any) => (
        <a href={r.fileUrl} target="_blank" rel="noreferrer">
          ⬇ Tải xuống
        </a>
      )
    },
    {
      title: "NGƯỜI ĐĂNG",
      dataIndex: "mentorName"
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📚 Thư viện tài liệu</Title>

      {/* UPLOAD */}
      <Card style={{ borderRadius: 16, marginBottom: 24 }}>
        <Title level={5}>📤 Tải tài liệu mới</Title>

        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Tiêu đề tài liệu</Text>
            <Input
              placeholder="Nhập tên tài liệu..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ marginTop: 8 }}
            />

            <Upload
              beforeUpload={f => {
                setFile(f);
                return false;
              }}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
                Chọn file
              </Button>
            </Upload>

            {file && (
              <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                📎 {file.name}
              </Text>
            )}

            <Button
              type="primary"
              style={{ marginTop: 16 }}
              onClick={onUpload}
            >
              ⬆ Tải lên ngay
            </Button>
          </Col>

          <Col span={12}>
            <Dragger
              beforeUpload={f => {
                setFile(f);
                return false;
              }}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined style={{ fontSize: 32 }} />
              </p>
              <p>Kéo & thả file vào đây hoặc click để chọn</p>
              <Text type="secondary">Dung lượng tối đa: 10MB</Text>
            </Dragger>
          </Col>
        </Row>
      </Card>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm tài liệu..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 260, marginBottom: 12 }}
      />

      <Card style={{ borderRadius: 16 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={materials.filter(m =>
            m.title?.toLowerCase().includes(search.toLowerCase())
          )}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
