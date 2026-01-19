import { Card, Tag, Button, message, Space } from "antd";
import type { Mentor } from "../../api/mentorPublicApi";
import {
    selectMentor,
    clearSelectedMentor,
} from "../../api/learnerMentorApi";
import { useNavigate } from "react-router-dom";

interface MentorCardProps {
    mentor: Mentor;
    selected?: boolean;
    disabled?: boolean;
}

const MentorCard = ({ mentor, selected, disabled }: MentorCardProps) => {
    const navigate = useNavigate();

    const handleSelectMentor = async () => {
        try {
            await selectMentor(mentor.id);
            message.success("Đã chọn mentor thành công");
            window.location.reload();
        } catch (err: any) {
            message.error(err?.response?.data || "Không thể chọn mentor");
        }
    };

    const handleClearMentor = async () => {
        try {
            await clearSelectedMentor();
            message.success("Đã huỷ mentor, bạn có thể chọn mentor khác");
            window.location.reload();
        } catch {
            message.error("Không thể huỷ mentor");
        }
    };

    const handleContinue = () => {
        navigate("/learner/with-mentor");
    };

    return (
        <Card
            title={
                <>
                    {mentor.fullName}
                    {selected && (
                        <Tag color="green" style={{ marginLeft: 8 }}>
                            Mentor hiện tại
                        </Tag>
                    )}
                </>
            }
            style={{
                width: 300,
                opacity: disabled ? 0.5 : 1,
                border: selected ? "2px solid #52c41a" : undefined,
            }}
        >
            <p>
                <b>Email:</b> {mentor.email}
            </p>

            <div>
                <b>Kỹ năng:</b>
                <div style={{ marginTop: 8 }}>
                    {mentor.skills?.length ? (
                        mentor.skills.map((skill) => (
                            <Tag key={skill.id} color="blue">
                                {skill.name}
                            </Tag>
                        ))
                    ) : (
                        <Tag>Chưa cập nhật</Tag>
                    )}
                </div>
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            {!selected && (
                <Button
                    type="primary"
                    block
                    disabled={disabled}
                    style={{ marginTop: 16 }}
                    onClick={handleSelectMentor}
                >
                    Chọn mentor
                </Button>
            )}

            {selected && (
                <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
                    <Button
                        type="primary"
                        block
                        onClick={handleContinue}
                    >
                        Tiếp tục
                    </Button>

                    <Button
                        danger
                        block
                        onClick={handleClearMentor}
                    >
                        Đổi mentor
                    </Button>
                </Space>
            )}
        </Card>
    );
};

export default MentorCard;
