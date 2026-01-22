import { Layout, Menu, Avatar, Spin } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRole, getMentorId } from "../utils/auth";
import { getMentorProfile } from "../api/mentorApi";

const { Sider, Content } = Layout;

export default function MentorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const mentorId = getMentorId();

  const [fullName, setFullName] = useState<string>("Mentor");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    if (getRole() !== "MENTOR") {
      navigate("/mentor", { replace: true });
    }
  }, []);

  /* ===== LOAD MENTOR PROFILE ===== */
  useEffect(() => {
    (async () => {
      try {
        const profile = await getMentorProfile();
        setFullName(profile?.fullName || "Mentor");
        setAvatarUrl((profile as any).avatarUrl || "");

      } catch (err) {
        console.error("Load mentor profile failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const menuItem = (
    key: string,
    label: string,
    icon: React.ReactNode,
    path: string
  ) => ({
    key,
    icon: (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            location.pathname === path ? "#e0edff" : "transparent",
          color:
            location.pathname === path ? "#2563eb" : "#cbd5f5",
        }}
      >
        {icon}
      </div>
    ),
    label: (
      <span
        style={{
          color:
            location.pathname === path ? "#2563eb" : "#e5e7eb",
          fontWeight:
            location.pathname === path ? 600 : 400,
        }}
      >
        {label}
      </span>
    ),
    onClick: () => navigate(path),
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={270}
        style={{
          background:
            "radial-gradient(circle at top left, #1e3a8a, #020617)",
          padding: "18px 14px",
          position: "relative",
        }}
      >
        {/* ===== HEADER (AVATAR + NAME) ===== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
            padding: "6px 6px",
          }}
        >
          {loading ? (
            <Spin />
          ) : (
            <>
              <Avatar
                size={56}
                src={avatarUrl || undefined}
                icon={!avatarUrl ? <UserOutlined /> : undefined}
                style={{
                  background: avatarUrl
                    ? undefined
                    : "linear-gradient(135deg,#3b82f6,#2563eb)",
                  boxShadow: "0 6px 18px rgba(59,130,246,0.45)",
                  flexShrink: 0,
                }}
              />

              <div style={{ lineHeight: 1.2 }}>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: 700,
                    letterSpacing: 0.2,
                  }}
                >
                  {fullName}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#c7d2fe",
                    marginTop: 2,
                  }}
                >
                  Mentor
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== MENU ===== */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            background: "transparent",
            border: "none",
          }}
          items={[
            menuItem("/mentor", "Tổng quan", <DashboardOutlined />, "/mentor"),
            menuItem(
              "/mentor/feedback",
              "Đánh giá và phản hồi",
              <FileTextOutlined />,
              "/mentor/feedback"
            ),
            menuItem(
              "/mentor/materials",
              "Kho tài liệu",
              <BookOutlined />,
              "/mentor/materials"
            ),
            menuItem(
              "/mentor/profile",
              "Hồ sơ cá nhân",
              <UserOutlined />,
              "/mentor/profile"
            ),

          ]}
        />

        {/* ===== LOGOUT ===== */}
        <div
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          style={{
            position: "absolute",
            bottom: 20,
            left: 14,
            right: 14,
            padding: "12px 16px",
            borderRadius: 12,
            cursor: "pointer",
            color: "#f87171",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <LogoutOutlined />
          Đăng xuất
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            background: "#f5f7fb",
            padding: 24,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
