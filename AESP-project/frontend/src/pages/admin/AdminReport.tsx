import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Typography } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { getAdminReport } from "../../api/adminService";
import type { AdminReport } from "../../api/adminService";
const { Title, Text } = Typography;

export default function AdminReportPage() {
  const [data, setData] = useState<AdminReport[]>([]);

  useEffect(() => {
    getAdminReport().then(setData);
  }, []);

  const totalRevenue = data.reduce(
    (sum, i) => sum + i.totalRevenue,
    0
  );

  const totalSold = data.reduce(
    (sum, i) => sum + i.totalSold,
    0
  );

  const columns = [
    {
      title: "Gói dịch vụ",
      dataIndex: "packageName",
      render: (v: string) => <Text strong>{v}</Text>,
    },
    {
      title: "Số lượt bán",
      dataIndex: "totalSold",
      align: "center" as const,
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      align: "right" as const,
      render: (v: number) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(v),
    },
  ];

  return (
    <div>
      <Title level={2}>📊 Báo cáo doanh thu</Title>
      <Text type="secondary">
        Thống kê doanh thu & số lượng gói learner đã mua
      </Text>

      <Row gutter={24} style={{ margin: "24px 0" }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng lượt mua"
              value={totalSold}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(v) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(Number(v))
              }
            />
          </Card>
        </Col>
      </Row>

      <Card title={<><BarChartOutlined /> Doanh thu theo gói</>}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="packageName"
          pagination={false}
        />
      </Card>
    </div>
  );
}
