import { Card, Avatar, Tag, Descriptions, Typography } from "antd";
import type { Mentor } from "../../api/mentorPublicApi";

const { Paragraph } = Typography;

interface Props {
    mentor: Mentor;
}

const MentorProfileView = ({ mentor }: Props) => {
    return (
        <Card title="Hồ sơ Mentor">
            <Avatar
                size={80}
                src={mentor.avatarUrl || undefined}
                style={{ marginBottom: 16 }}
            >
                {!mentor.avatarUrl && mentor.fullName.charAt(0)}
            </Avatar>

            <Descriptions column={1} bordered>
                <Descriptions.Item label="Họ tên">
                    {mentor.fullName}
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                    {mentor.email}
                </Descriptions.Item>


                <Descriptions.Item label="Giới thiệu">
                    {mentor.bio ? (
                        <Paragraph>{mentor.bio}</Paragraph>
                    ) : (
                        "Chưa cập nhật"
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Kỹ năng">
                    {mentor.skills && mentor.skills.length > 0
                        ? mentor.skills.map((skill) => (
                              <Tag key={skill.id} color="blue">
                                  {skill.name}
                              </Tag>
                          ))
                        : "Chưa cập nhật"}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default MentorProfileView;
