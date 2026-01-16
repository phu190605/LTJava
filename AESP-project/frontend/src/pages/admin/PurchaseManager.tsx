import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Input,
  Badge,
  Statistic,
  Typography,
  Spin
} from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";

const { Title, Text } = Typography;
const { Search } = Input;

interface Purchase {
  learnerEmail?: string;
  learnerName?: string;
  packageName?: string;
  amount?: number;
  date?: string; 
  status?: "SUCCESS" | "FAILED";
}

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  return (
    d.toLocaleDateString("vi-VN") +
    " " +
    d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );
};

const PurchaseManager: React.FC = () => {
  const [data, setData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res: any = await axiosClient.get("/admin/payments");
      setData(Array.isArray(res) ? res : []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((p) => {
    const name = (p.learnerName ?? "").toLowerCase();
    const email = (p.learnerEmail ?? "").toLowerCase();
    const pkg = (p.packageName ?? "").toLowerCase();
    const key = search.toLowerCase();
    return name.includes(key) || email.includes(key) || pkg.includes(key);
  });

  const totalRevenue = filteredData
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const columns = [
    {
      title: "Learner",
      render: (_: any, r: Purchase) => (
        <>
          <div style={{ fontWeight: 600 }}>{r.learnerName || "—"}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {r.learnerEmail}
          </div>
        </>
      )
    },
    {
      title: "Gói học",
      dataIndex: "packageName"
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      align: "right" as const,
      render: (v: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND"
        }).format(v || 0)
    },
    {
      title: "Ngày mua",
      dataIndex: "date", 
      render: (v: string) => formatDateTime(v)
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center" as const,
      render: (v: string) =>
        v === "SUCCESS" ? (
          <Badge status="success" text="Thành công" />
        ) : (
          <Badge status="error" text="Thất bại" />
        )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 30 }}>
        <Title level={2}>💳 Quản lý mua gói học</Title>
        <Text type="secondary">
          Theo dõi learner, gói đã mua và doanh thu hệ thống
        </Text>
      </div>

      <Row gutter={24} style={{ marginBottom: 30 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng lượt mua"
              value={filteredData.length}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Giao dịch thành công"
              value={filteredData.filter(p => p.status === "SUCCESS").length}
              valueStyle={{ color: "#3f8600" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(v) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND"
                }).format(Number(v))
              }
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            📋 Danh sách learner đã mua
          </Title>

          <Search
            placeholder="Tìm tên, email hoặc gói"
            allowClear
            style={{ width: 320 }}
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
            dataSource={filteredData}
            rowKey={(_, i) => String(i)}
            pagination={{ pageSize: 6 }}
          />
        )}
      </Card>
    </div>
  );
};

export default PurchaseManager;
