import { useEffect, useState } from "react";
import {
    Tabs,
    Spin,
    Empty,
    Typography,
    Button,
    Card,
    Tag,
    Row,
    Col,
    Space
} from "antd";
import {
    FilePdfOutlined,
    FileWordOutlined,
    VideoCameraOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import { getSelectedMentor } from "../../api/learnerMentorApi";
import { getMyMentorMaterials } from "../../api/learnerMaterialApi";
import type { LearningMaterial } from "../../api/learnerMaterialApi";

const { Title, Text } = Typography;

const getFileIcon = (type: string) => {
    if (type?.includes("PDF")) return <FilePdfOutlined style={{ color: "#ef4444" }} />;
    if (type?.includes("DOC")) return <FileWordOutlined style={{ color: "#2563eb" }} />;
    if (type?.includes("MP4")) return <VideoCameraOutlined style={{ color: "#9333ea" }} />;
    return <FilePdfOutlined />;
};

export default function WithMentorPage() {
    const [loading, setLoading] = useState(true);
    const [mentor, setMentor] = useState<any>(null);
    const [materials, setMaterials] = useState<LearningMaterial[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const selectedMentor = await getSelectedMentor();
                if (!selectedMentor) return;
                setMentor(selectedMentor);

                const list = await getMyMentorMaterials();
                setMaterials(Array.isArray(list) ? list : []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Spin />;

    return (
        <div style={{ padding: 24 }}>
            {/* ===== HEADER ===== */}
            <Title level={3}>
                🤝 Học với Mentor {mentor?.fullName}
                <Tag color="blue" style={{ marginLeft: 8 }}>PRO MENTOR</Tag>
            </Title>
            <Text type="secondary">
                Cùng nâng tầm kỹ năng ngôn ngữ của bạn ngay hôm nay.
            </Text>

            <Row gutter={24} style={{ marginTop: 24 }}>
                {/* ===== MAIN CONTENT ===== */}
                <Col span={17}>
                    <Tabs
                        defaultActiveKey="materials"
                        items={[
                            {
                                key: "materials",
                                label: "📚 Tài liệu tham khảo",
                                children:
                                    materials.length === 0 ? (
                                        <Empty
                                            description="Mentor chưa đăng tài liệu nào"
                                            style={{ marginTop: 48 }}
                                        />
                                    ) : (
                                        <Card
                                            style={{ borderRadius: 16 }}
                                            bodyStyle={{ padding: 0 }}
                                        >
                                            {materials.map((m) => (
                                                <div
                                                    key={m.id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "16px 24px",
                                                        borderBottom: "1px solid #f1f5f9",
                                                    }}
                                                >
                                                    <div style={{ fontSize: 28, marginRight: 16 }}>
                                                        {getFileIcon(m.type)}
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <Text strong>{m.title}</Text>
                                                        <div>
                                                            <Tag>{m.type}</Tag>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        type="primary"
                                                        icon={<DownloadOutlined />}
                                                        href={m.fileUrl}
                                                        target="_blank"
                                                    >
                                                        Tải file
                                                    </Button>
                                                </div>
                                            ))}
                                        </Card>
                                    ),
                            },
                            {
                                key: "practice",
                                label: "🧠 Thực hành",
                                children: (
                                    <Empty
                                        description="Tính năng đang được phát triển 🚧"
                                        style={{ marginTop: 48 }}
                                    />
                                ),
                            },
                        ]}
                    />
                </Col>

                {/* ===== SIDEBAR ===== */}
                <Col span={7}>
                    <Card
                        title="⭐ Mentor Spotlight"
                        style={{ borderRadius: 16 }}
                    >
                        <Space direction="vertical">
                            <Text strong>Chuyên môn</Text>
                            <Space wrap>
                                <Tag color="blue">IELTS</Tag>
                                <Tag color="green">Business English</Tag>
                                <Tag color="purple">Speaking</Tag>
                            </Space>

                            <Text strong style={{ marginTop: 12 }}>
                                Thông tin liên hệ
                            </Text>
                            <Text>{mentor?.email}</Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
