import { useEffect, useState } from "react";
import {
  getMentorProfile,
  updateMentorProfile,
  uploadAvatar,
  uploadCertificate
} from "../../api/mentorApi";
import {
  Input,
  Button,
  message,
  Upload,
  Card,
  Avatar,
  Tag,
  Space,
  Typography
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  CheckCircleFilled
} from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";

const { Text, Title } = Typography;

/* ===== TYPES ===== */
type Skill = {
  id: number;
  name: string;
};

type MentorProfile = {
  id: number;
  fullName: string;
  email: string;
  role: "MENTOR";
  bio?: string;
  avatarUrl?: string;
  certificates?: string;
  skills?: Skill[];
};

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [certificates, setCertificates] = useState<string[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = (await getMentorProfile()) as MentorProfile;

      setFullName(data.fullName ?? "");
      setBio(data.bio ?? "");
      setAvatarUrl(data.avatarUrl ?? "");
      setSkills(data.skills ?? []);

      setCertificates(
        data.certificates
          ? data.certificates.split(",").map(c => c.trim())
          : []
      );
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải hồ sơ mentor");
    }
  };

  const saveProfile = async () => {
    setLoading(true);

    try {
      await updateMentorProfile({
        fullName,
        bio,
        certificates: certificates.join(",")
      });

      message.success("💾 Đã lưu thay đổi");
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }

    setLoading(false);
  };

  const handleUploadAvatar = async () => {
    if (!selectedAvatar) {
      return message.warning("Vui lòng chọn ảnh trước");
    }

    try {
      const res = await uploadAvatar(selectedAvatar);
      setAvatarUrl(res.avatarUrl);
      setSelectedAvatar(null);
      setPreview(null);
      message.success("🖼 Upload avatar thành công");
    } catch (err) {
      console.error(err);
      message.error("Upload avatar thất bại");
    }
  };

  const handleUploadCertificate = async (info: UploadChangeParam) => {
    if (!info.file.originFileObj) return;

    try {
      const res = await uploadCertificate(info.file.originFileObj);
      setCertificates(res.certificates.split(","));
      message.success("📄 Upload chứng chỉ thành công");
    } catch (err) {
      console.error(err);
      message.error("Upload chứng chỉ thất bại");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <Title level={3}>👤 Hồ sơ Mentor</Title>

      {/* ===== AVATAR ===== */}
      <Card title="Ảnh đại diện" style={{ marginBottom: 24 }}>
        <Space align="center" size={24}>
          <Avatar
            size={120}
            src={preview || avatarUrl || undefined}
            icon={<UserOutlined />}
          />

          <Space orientation="vertical">
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                setSelectedAvatar(file);
                setPreview(URL.createObjectURL(file));
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>
                Chọn ảnh mới
              </Button>
            </Upload>

            <Button type="primary" onClick={handleUploadAvatar}>
              Cập nhật ảnh đại diện
            </Button>
          </Space>
        </Space>
      </Card>

      {/* ===== PERSONAL INFO ===== */}
      <Card title="Thông tin cá nhân" style={{ marginBottom: 24 }}>
        <Text strong>Họ và tên</Text>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <Text strong>Giới thiệu</Text>
        <Input.TextArea
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </Card>

      {/* ===== SKILLS ===== */}
      <Card title="Kỹ năng chuyên môn" style={{ marginBottom: 24 }}>
        {skills.length === 0 ? (
          <Text type="secondary">Chưa có kỹ năng</Text>
        ) : (
          <Space wrap>
            {skills.map(skill => (
              <Tag
                key={skill.id}
                color="blue"
                icon={<CheckCircleFilled />}
              >
                {skill.name}
              </Tag>
            ))}
          </Space>
        )}
      </Card>

      {/* ===== CERTIFICATES ===== */}
      <Card title="Chứng chỉ" style={{ marginBottom: 24 }}>
        {certificates.length === 0 ? (
          <Text type="secondary">Chưa có chứng chỉ</Text>
        ) : (
          <ul>
            {certificates.map((c, idx) => (
              <li key={idx}>
                <a href={c} target="_blank" rel="noreferrer">
                  {c.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        )}

        <Upload
          showUploadList={false}
          customRequest={() => { }}
          onChange={handleUploadCertificate}
        >
          <Button icon={<UploadOutlined />}>
            Thêm chứng chỉ
          </Button>
        </Upload>
      </Card>

      <Button
        type="primary"
        loading={loading}
        onClick={saveProfile}
        block
        style={{ height: 44 }}
      >
        💾 Lưu tất cả thay đổi
      </Button>
    </div>
  );
}
