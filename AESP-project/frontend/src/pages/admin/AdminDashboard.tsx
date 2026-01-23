import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "../../css/admin-dashboard.css";

import { Card, Row, Col, Statistic, Table, Typography } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import { getAdminReport } from "../../api/adminService";
import type { AdminReport } from "../../api/adminService";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    mentors: 0,
  });

  const [reportData, setReportData] = useState<AdminReport[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = (await axiosClient.get("/admin/users")) as any[];
        const mentors = (await axiosClient.get("/admin/mentors")) as any[];

        setStats({
          users: users.length,
          mentors: mentors.length,
        });
      } catch (e) {
        console.error(e);
      }
    };

    loadStats();
    getAdminReport().then(setReportData);
  }, []);

  const totalRevenue = reportData.reduce(
    (sum, i) => sum + i.totalRevenue,
    0
  );

  const totalSold = reportData.reduce(
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
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>

      {/* ====== TOP STATS ====== */}
      <div className="dashboard-grid">
        <DashboardCard title="Users" value={stats.users} />
        <DashboardCard title="Mentors" value={stats.mentors} />
      </div>

      {/* ====== REPORT SECTION ====== */}
      <div style={{ marginTop: 32 }}>
        <div className="dashboard-grid" style={{ marginTop: 32,marginBottom: 24 }}>
          <Card>
            <Statistic
              title="Tổng lượt mua"
              value={totalSold}
              prefix={<ShoppingOutlined />}
            />
          </Card>

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
        </div>

        <Card title={<><BarChartOutlined /> Doanh thu theo gói</>}>
          <Table
            columns={columns}
            dataSource={reportData}
            rowKey="packageName"
            pagination={false}
          />
        </Card>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
