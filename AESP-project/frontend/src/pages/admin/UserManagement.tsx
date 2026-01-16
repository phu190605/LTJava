import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Badge,
  Button,
  Popconfirm,
  Space,
  message,
  Spin,
  Input
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";

const { Title, Text } = Typography;
const { Search } = Input;

interface User {
  id: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "MENTOR" | "LEARNER";
  active: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await axiosClient.get("/admin/users");
      setUsers(Array.isArray(res) ? res : []);
    } catch {
      message.error("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id: number) => {
    try {
      await axiosClient.put(`/admin/users/${id}/disable`);
      message.success("Đã vô hiệu hóa user");
      fetchUsers();
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  const handleEnable = async (id: number) => {
    try {
      await axiosClient.put(`/admin/users/${id}/enable`);
      message.success("Đã kích hoạt user");
      fetchUsers();
    } catch {
      message.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/admin/users/${id}`);
      message.success("Đã xóa user");
      fetchUsers();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "User",
      render: (_: any, r: User) => (
        <>
          <div style={{ fontWeight: 600 }}>{r.fullName}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.email}</div>
        </>
      )
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center" as const,
      render: (v: string) => {
        const color =
          v === "ADMIN" ? "red" : v === "MENTOR" ? "blue" : "green";
        return <Badge color={color} text={v} />;
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      align: "center" as const,
      render: (v: boolean) =>
        v ? (
          <Badge status="success" text="Hoạt động" />
        ) : (
          <Badge status="error" text="Đã khóa" />
        )
    },
    {
      title: "Hành động",
      align: "center" as const,
      render: (_: any, r: User) => (
        <Space>
          {r.active ? (
            <Button
              icon={<LockOutlined />}
              onClick={() => handleDisable(r.id)}
            >
              Khóa
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<UnlockOutlined />}
              onClick={() => handleEnable(r.id)}
            >
              Mở khóa
            </Button>
          )}

          <Popconfirm
            title="Xóa user này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(r.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>👥 Quản lý người dùng</Title>
      <Text type="secondary">
        Quản lý tài khoản Admin / Mentor / Learner
      </Text>

      <Card style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            📋 Danh sách người dùng
          </Title>

          <Search
            placeholder="Tìm theo tên hoặc email"
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{ pageSize: 8 }}
          />
        )}
      </Card>
    </div>
  );
};

export default UserManagement;
