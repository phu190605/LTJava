import React, { useEffect, useState } from "react";
import { Card, Button, Input, Typography, message, Divider } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";

const { Title } = Typography;
const { TextArea } = Input;

interface SystemPolicy {
  id: number;
  type: "TERMS" | "PRIVACY";
  content: string;
  version: string;
  active: boolean;
}

const PolicyManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");

  // ✅ LOAD POLICY KHI VÀO TRANG
  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const termsRes: SystemPolicy = await axiosClient.get(
        "/admin/policies/TERMS"
      );
      setTerms(termsRes.content);

      const privacyRes: SystemPolicy = await axiosClient.get(
        "/admin/policies/PRIVACY"
      );
      setPrivacy(privacyRes.content);
    } catch (e) {
      message.warning("Chưa có chính sách, vui lòng tạo mới");
    }
  };

  const handleSave = async () => {
    if (!terms || !privacy) {
      return message.warning("Vui lòng nhập đầy đủ nội dung chính sách!");
    }

    setLoading(true);
    try {
      await axiosClient.post("/admin/policies", {
        type: "TERMS",
        content: terms,
      });

      await axiosClient.post("/admin/policies", {
        type: "PRIVACY",
        content: privacy,
      });

      message.success("Cập nhật chính sách hệ thống thành công!");
      loadPolicies(); // ✅ reload lại từ DB
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi lưu chính sách!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <Card style={{ maxWidth: 800, margin: "0 auto" }}>
        <Title level={3}>Thiết lập chính sách hệ thống</Title>
        <Divider />

        <Title level={5}>Điều khoản sử dụng</Title>
        <TextArea
          rows={8}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />

        <Divider />

        <Title level={5}>Chính sách quyền riêng tư</Title>
        <TextArea
          rows={8}
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
        />

        <Divider />

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
        >
          Lưu chính sách
        </Button>
      </Card>
    </div>
  );
};

export default PolicyManager;
