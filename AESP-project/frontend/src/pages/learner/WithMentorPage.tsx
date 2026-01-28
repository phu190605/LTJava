// Quy đổi điểm sang level (A1, A2, B1, B2)
function convertScoreToLevel(score?: string | number | null): string {
    if (score == null || score === "") return "Chưa có";
    const s = typeof score === "string" ? parseFloat(score) : score;
    if (isNaN(s)) return "Chưa có";
    if (s >= 80) return "B2";
    if (s >= 60) return "B1";
    if (s >= 40) return "A2";
    return "A1";
}

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

import { getSelectedMentor, getPlacementResult } from "../../api/learnerMentorApi";
import type { PlacementResult } from "../../api/learnerMentorApi";
import { getMyMentorMaterials } from "../../api/learnerMaterialApi";
import type { LearningMaterial } from "../../api/learnerMaterialApi";
import { getLearnerConversation } from "../../api/chatApi";

import ChatModal from "../../components/chat/ChatModal";

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
    const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null);

    const [openChat, setOpenChat] = useState(false);
    const [conversationId, setConversationId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const selectedMentor = await getSelectedMentor();
                if (!selectedMentor) return;
                setMentor(selectedMentor);

                const list = await getMyMentorMaterials();
                setMaterials(Array.isArray(list) ? list : []);

                const placement = await getPlacementResult();
                setPlacementResult(placement);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Spin />;

    return (
        <div style={{ padding: 24 }}>
            <Title level={3}>
                🤝 Học với Mentor {mentor?.fullName}
                <Tag color="blue" style={{ marginLeft: 8 }}>PRO MENTOR</Tag>
            </Title>

            <Text type="secondary">
                Cùng nâng tầm kỹ năng ngôn ngữ của bạn ngay hôm nay.
            </Text>

            <Row gutter={24} style={{ marginTop: 24 }}>
                <Col span={17}>
                    <Tabs
                        defaultActiveKey="placement"
                        items={[
                            {
                                key: "placement",
                                label: "📝 Kết quả kiểm tra đầu vào",
                                children: placementResult ? (
                                    <Card style={{ borderRadius: 12, marginTop: 16 }}>
                                        <div>
                                            <b>Điểm test đầu vào:</b>{" "}
                                            {placementResult.levelBefore || "Chưa có"}
                                            {placementResult.levelBefore && (
                                                <span style={{ marginLeft: 12 }}>
                                                    (Level: {convertScoreToLevel(placementResult.levelBefore)})
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <b>Level sau khi mentor đánh giá:</b>{" "}
                                            {placementResult.levelAfter || "Chưa có"}
                                        </div>
                                        <div>
                                            <b>Nhận xét của mentor:</b>{" "}
                                            {placementResult.mentorNote || (
                                                <span style={{ color: "#888" }}>Chưa có nhận xét</span>
                                            )}
                                        </div>
                                    </Card>
                                ) : (
                                    <Empty description="Chưa có dữ liệu kiểm tra đầu vào." style={{ marginTop: 48 }} />
                                ),
                            },
                            {
                                key: "materials",
                                label: "📚 Tài liệu tham khảo",
                                children:
                                    materials.length === 0 ? (
                                        <Empty description="Mentor chưa đăng tài liệu nào" style={{ marginTop: 48 }} />
                                    ) : (
                                        <Card style={{ borderRadius: 16 }} styles={{
    body: { padding: 0 }
  }}>
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
                                                        <div><Tag>{m.type}</Tag></div>
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

                            
                        ]}
                    />
                </Col>

                <Col span={7}>
                    <Card title="⭐ Mentor Spotlight" style={{ borderRadius: 16 }}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <Text strong>Chuyên môn</Text>
                            <Space wrap>
    {mentor?.skills?.length > 0 ? (
        mentor.skills.map((skill: string, index: number) => (
            <Tag key={index} color="blue">
                {skill}
            </Tag>
        ))
    ) : (
        <Text type="secondary">Chưa cập nhật chuyên môn</Text>
    )}
</Space>


                            <Text strong style={{ marginTop: 12 }}>Thông tin liên hệ</Text>
                            <Text>{mentor?.email}</Text>
                            <Button
                                type="primary"
                                block
                                style={{ marginTop: 16 }}
                                onClick={async () => {
                                    try {
                                        const convo = await getLearnerConversation();
                                        setConversationId(convo.id);
                                        setOpenChat(true);
                                    } catch {

                                    }
                                }}
                            >
                                💬 Chat với mentor
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {mentor && conversationId && (
                <ChatModal
                    open={openChat}
                    onClose={() => setOpenChat(false)}
                    conversationId={conversationId}
                    currentUser={{
                        id: 0,
                        fullName: "Learner",
                    }}
                    targetUser={{
                        id: mentor.id,
                        fullName: mentor.fullName,
                        avatarUrl: mentor.avatarUrl,
                    }}
                />
            )}
        </div>
    );
}
