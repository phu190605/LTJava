import React, { useState, useEffect } from "react";
import type { LoginResponse } from "../types/auth";
import { Modal, Form, Input, Button, Typography, message, Row, Col, Divider, Steps, theme } from "antd";
import {
  UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined,
  ArrowLeftOutlined, GoogleOutlined, FacebookFilled, EyeInvisibleOutlined, EyeTwoTone
} from "@ant-design/icons";
import axiosClient from "../api/axiosClient";
import { checkHasTested } from "../api/userTestApi";
import { useNavigate } from "react-router-dom";
import logoImg from '../assets/images/logo.png'; 
import { Checkbox, Spin } from "antd";
import { getPolicyByType } from "../api/policyService";
import type { SystemPolicy } from "../api/policyService";

const { Title, Text } = Typography;


const PRIMARY_COLOR = '#2B4DFF';
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #2B4DFF 0%, #8752f3 100%)';
const INPUT_BG = '#F8FAFC';


const cssStyles = `
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .auth-modal-content {
    animation: slideUpFade 0.4s ease-out;
  }
  .custom-input .ant-input, .custom-input .ant-input-password {
    background-color: ${INPUT_BG} !important;
    border: 1px solid transparent !important;
    transition: all 0.3s;
  }
  .custom-input .ant-input:focus, .custom-input .ant-input-affix-wrapper:focus-within {
    background-color: #fff !important;
    border-color: ${PRIMARY_COLOR} !important;
    box-shadow: 0 0 0 4px rgba(43, 77, 255, 0.1) !important;
  }
  .auth-modal .ant-modal-content {
    padding: 0 !important;
    border-radius: 24px;
    overflow: hidden;
  }
  .policy-modal .ant-modal-content {
  padding: 24px !important;
  border-radius: 16px !important;
  overflow: visible !important;
  }

.policy-modal .ant-modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
  }
`;

type AuthView = "LOGIN" | "REGISTER" | "FORGOT_EMAIL" | "VERIFY_OTP" | "RESET_PASSWORD";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "LOGIN" | "REGISTER";
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = "LOGIN" }) => {
  const [view, setView] = useState<AuthView>(initialView);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const [openPolicy, setOpenPolicy] = useState(false);
  const [policyType, setPolicyType] = useState<"TERMS" | "PRIVACY">("TERMS");
  const [policyCache, setPolicyCache] = useState<
    Record<string, SystemPolicy>
  >({});
  const [policy, setPolicy] = useState<SystemPolicy | null>(null);
  const [loadingPolicy, setLoadingPolicy] = useState(false);

  // State luồng quên mật khẩu
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // 0: Email, 1: OTP, 2: New Pass

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      form.resetFields();
      setOpenPolicy(false);
      setResetEmail("");
      setResetToken("");
      setCurrentStep(0);
    }
  }, [isOpen, initialView, form]);
  /* ================== POLICY HANDLER ================== */
  const handleOpenPolicy = async (type: "TERMS" | "PRIVACY") => {
    setPolicyType(type);
    setOpenPolicy(true);


    if (policyCache[type]) {
      setPolicy(policyCache[type]);
      return;
    }

    setLoadingPolicy(true);
    try {
      const data = await getPolicyByType(type);
      setPolicy(data);
      setPolicyCache((prev) => ({ ...prev, [type]: data }));
    } catch (e) {
      message.error("Không tải được chính sách");
    } finally {
      setLoadingPolicy(false);
    }
  };

  // --- API HANDLERS ---
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = (await axiosClient.post(
        "/auth/login",
        values
      )) as LoginResponse;

      if (res.role === "ADMIN") {
        window.location.href = "/";
        message.error("Sai mật khẩu hoặc email");
        return;
      }
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));
      localStorage.setItem("userId", res.id.toString()); // Lưu userId để dashboard và API lấy đúng

      if (res.role === "MENTOR") {
        localStorage.setItem("mentorId", String(res.id));
      }

      message.success("Chào mừng bạn quay trở lại!");
      onClose();

      if (res.role === "MENTOR") {
        window.location.href = "/mentor";
      } else {
        // Kiểm tra đã test đầu vào chưa
        try {
          const hasTested = await checkHasTested();
          if (hasTested) {
            navigate("/dashboard");
          } else {
            navigate("/speaking-test");
          }
        } catch (e) {
          // fallback nếu lỗi API
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      message.error(error?.response?.data || "Đăng nhập thất bại");
    }
    setLoading(false);
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      // Loại bỏ agreePolicy khỏi payload gửi lên backend
      const { agreePolicy, ...payload } = values;
      await axiosClient.post("/auth/register", payload);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setView("LOGIN");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng ký thất bại");
    }
    setLoading(false);
  };

  const handleSendOtp = async (values: { email: string }) => {
    setLoading(true);
    try {
      await axiosClient.post("/auth/forgot-password", { email: values.email });
      setResetEmail(values.email);
      message.success("Mã OTP đã được gửi!");
      setView("VERIFY_OTP");
      setCurrentStep(1);
    } catch (error: any) {
      message.error("Lỗi gửi mail hoặc email không tồn tại.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("/auth/verify-otp", { email: resetEmail, otp: values.otp });
      setResetToken(res.data.token);
      message.success("Xác thực thành công!");
      setView("RESET_PASSWORD");
      setCurrentStep(2);
    } catch (error: any) {
      message.error("OTP sai hoặc hết hạn.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (values: { password: string }) => {
    setLoading(true);
    try {
      await axiosClient.post("/auth/reset-password", { token: resetToken, newPassword: values.password });
      message.success("Đổi mật khẩu thành công!");
      setView("LOGIN");
    } catch (error: any) {
      message.error("Lỗi đổi mật khẩu.");
    }
    setLoading(false);
  };

  // --- STYLES OBJECTS ---
  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)',
    padding: '40px 30px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #F1F5F9',
    position: 'relative'
  };

  const formContainerStyle: React.CSSProperties = {
    padding: '30px 30px 40px'
  };

  const btnPrimaryStyle: React.CSSProperties = {
    height: '50px',
    borderRadius: '12px',
    background: PRIMARY_GRADIENT,
    border: 'none',
    fontWeight: 600,
    fontSize: '16px',
    boxShadow: '0 8px 20px rgba(43, 77, 255, 0.25)',
    transition: 'transform 0.2s',
  };

  const btnSocialStyle: React.CSSProperties = {
    height: '45px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#475569'
  };

  // --- RENDER HELPERS ---
  const AuthHeader = ({ title, subtitle, showLogo = true }: { title: string, subtitle: string, showLogo?: boolean }) => (
    <div style={headerStyle}>
      {showLogo && <img src={logoImg} alt="Logo" style={{ height: 50, marginBottom: 15 }} />}
      <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0F172A', fontSize: '26px' }}>{title}</Title>
      <Text style={{ fontSize: '15px', color: '#64748B', marginTop: 5, display: 'block' }}>{subtitle}</Text>
    </div>
  );

  // --- RENDER CONTENT ---
  const renderContent = () => {
    switch (view) {
      // === LOGIN VIEW ===
      case "LOGIN":
        return (
          <div className="auth-modal-content">
            <AuthHeader title="Chào mừng trở lại!" subtitle="Cùng AESP chinh phục tiếng Anh mỗi ngày" />
            <div style={formContainerStyle}>
              <Form form={form} layout="vertical" onFinish={handleLogin} size="large">
                <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập Email" }, { type: 'email' }]}>
                  <Input prefix={<MailOutlined style={{ color: '#94A3B8' }} />} placeholder="Email của bạn" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }} />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
                    placeholder="Mật khẩu"
                    className="custom-input"
                    iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor={PRIMARY_COLOR} /> : <EyeInvisibleOutlined />)}
                    style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }}
                  />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: -5 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Ghi nhớ đăng nhập</Text>
                  <a onClick={() => setView("FORGOT_EMAIL")} style={{ color: PRIMARY_COLOR, fontWeight: 600, fontSize: 14 }}>Quên mật khẩu?</a>
                </div>

                <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>
                  Đăng nhập
                </Button>

                <Divider style={{ margin: '25px 0', color: '#94A3B8', fontSize: 13 }}>Hoặc tiếp tục với</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    <Button block style={btnSocialStyle} icon={<GoogleOutlined style={{ color: '#EA4335', fontSize: 18 }} />}>
                      Google
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button block style={btnSocialStyle} icon={<FacebookFilled style={{ color: '#1877F2', fontSize: 18 }} />}>
                      Facebook
                    </Button>
                  </Col>
                </Row>
              </Form>
              <div style={{ textAlign: 'center', marginTop: 25 }}>
                <Text style={{ color: '#64748B' }}>Chưa có tài khoản? </Text>
                <a onClick={() => setView("REGISTER")} style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>Đăng ký ngay</a>
              </div>
            </div>
          </div>
        );

      // === REGISTER VIEW ===
      case "REGISTER":
        return (
          <div className="auth-modal-content">
            <AuthHeader title="Tạo tài khoản mới" subtitle="Tham gia cộng đồng học viên AESP" />
            <div style={formContainerStyle}>
              <Form form={form} layout="vertical" onFinish={handleRegister} size="large">
                <Form.Item name="fullName" rules={[{ required: true, message: "Nhập họ tên" }]}>
                  <Input prefix={<UserOutlined style={{ color: '#94A3B8' }} />} placeholder="Họ và tên" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }} />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: "Nhập Email" }, { type: 'email' }]}>
                  <Input prefix={<MailOutlined style={{ color: '#94A3B8' }} />} placeholder="Email" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }} />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: "Nhập mật khẩu" }, { min: 6 }]}>
                  <Input.Password prefix={<LockOutlined style={{ color: '#94A3B8' }} />} placeholder="Mật khẩu" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }} />
                </Form.Item>
                <Form.Item name="agreePolicy" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("Bạn phải đồng ý với điều khoản sử dụng")), },]} shouldUpdate>
                  <Checkbox style={{ fontSize: 13 }}>
                    Tôi đồng ý với{" "}
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenPolicy("TERMS");
                      }}
                      style={{ color: PRIMARY_COLOR, fontWeight: 600 }}
                    >
                      Điều khoản sử dụng
                    </a>
                    {" "}và{" "}
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenPolicy("PRIVACY");
                      }}
                      style={{ color: PRIMARY_COLOR, fontWeight: 600 }}
                    >
                      Chính sách bảo mật
                    </a>
                  </Checkbox>
                </Form.Item>
                <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>
                  Đăng ký miễn phí
                </Button>
              </Form>
              <div style={{ textAlign: 'center', marginTop: 25 }}>
                <Text style={{ color: '#64748B' }}>Đã có tài khoản? </Text>
                <a onClick={() => setView("LOGIN")} style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>Đăng nhập</a>
              </div>
            </div>
          </div>
        );

      // === FORGOT PASSWORD FLOW ===
      case "FORGOT_EMAIL":
      case "VERIFY_OTP":
      case "RESET_PASSWORD":
        return (
          <div className="auth-modal-content">
            {/* Header cho luồng Quên MK */}
            <div style={{ ...headerStyle, paddingBottom: 10 }}>
              <Title level={3} style={{ marginBottom: 20 }}>Khôi phục mật khẩu</Title>
              <Steps
                current={currentStep}
                size="small"
                items={[
                  { title: 'Email' },
                  { title: 'OTP' },
                  { title: 'Mật khẩu mới' },
                ]}
              />
            </div>

            <div style={formContainerStyle}>
              {/* STEP 1: EMAIL */}
              {view === "FORGOT_EMAIL" && (
                <Form layout="vertical" onFinish={handleSendOtp} size="large">
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 60, height: 60, background: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      <MailOutlined style={{ fontSize: 24, color: PRIMARY_COLOR }} />
                    </div>
                    <Text type="secondary">Nhập email đăng ký để nhận mã xác thực.</Text>
                  </div>
                  <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
                    <Input placeholder="Email của bạn" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none', textAlign: 'center' }} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Gửi mã OTP</Button>
                </Form>
              )}

              {/* STEP 2: OTP */}
              {view === "VERIFY_OTP" && (
                <Form layout="vertical" onFinish={handleVerifyOtp} size="large">
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 60, height: 60, background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      <SafetyCertificateOutlined style={{ fontSize: 24, color: '#16A34A' }} />
                    </div>
                    <Text type="secondary">Nhập mã 6 số gửi tới <b>{resetEmail}</b></Text>
                  </div>
                  <Form.Item name="otp" rules={[{ required: true }, { len: 6 }]}>
                    <Input
                      placeholder="• • • • • •"
                      maxLength={6}
                      className="custom-input"
                      style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none', textAlign: 'center', fontSize: 24, letterSpacing: 8, fontWeight: 700 }}
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Xác thực</Button>
                  <Button type="link" onClick={() => handleSendOtp({ email: resetEmail })} style={{ display: 'block', margin: '15px auto 0', color: '#64748B' }}>Gửi lại mã</Button>
                </Form>
              )}

              {/* STEP 3: RESET PASS */}
              {view === "RESET_PASSWORD" && (
                <Form layout="vertical" onFinish={handleResetPassword} size="large">
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 60, height: 60, background: '#FAF5FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                      <LockOutlined style={{ fontSize: 24, color: '#9333EA' }} />
                    </div>
                    <Text type="secondary">Thiết lập mật khẩu mới cho tài khoản.</Text>
                  </div>
                  <Form.Item name="password" rules={[{ required: true }, { min: 6 }]}>
                    <Input.Password placeholder="Mật khẩu mới" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }} />
                  </Form.Item>
                  <Form.Item name="confirm" rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Mật khẩu không khớp!')); } })]}>
                    <Input.Password placeholder="Nhập lại mật khẩu" className="custom-input" style={{ borderRadius: 12, height: 50, backgroundColor: INPUT_BG, border: 'none' }} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Hoàn tất</Button>
                </Form>
              )}

              <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => setView("LOGIN")} style={{ display: 'block', margin: '10px auto 0', color: '#64748B' }}>
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* ===== POLICY MODAL ===== */}
      <Modal
        open={openPolicy}
        onCancel={() => setOpenPolicy(false)}
        footer={null}
        width={720}
        centered
        zIndex={2000}
        wrapClassName="policy-modal"
        title={
          policyType === "TERMS"
            ? `Điều khoản sử dụng (${policy?.version})`
            : `Chính sách bảo mật (${policy?.version})`
        }
      >
        {loadingPolicy ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <Typography.Paragraph style={{ whiteSpace: "pre-line" }}>
            {policy?.content}
          </Typography.Paragraph>
        )}
      </Modal>
      <style>{cssStyles}</style>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={450}
        centered
        destroyOnHidden
        closable={false}
        maskClosable={false} // Bắt buộc bấm X để đóng, tránh đóng nhầm
        style={{ top: 20 }}
        wrapClassName="auth-modal"
        modalRender={(modal) => (
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            background: '#fff'
          }}>
            {modal}
          </div>
        )}
      >
        {/* Nút đóng Custom */}
        <div
          onClick={onClose}
          style={{
            position: 'absolute', top: 15, right: 15, zIndex: 100, cursor: 'pointer',
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)',
            borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#64748B', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}
        >
          ✕
        </div>

        {renderContent()}
      </Modal>
    </>
  );
};

export default AuthModal;