

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Typography, message, Divider, Steps, Space } from "antd";
import { 
  UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined, 
  ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined, FacebookFilled
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import axiosClient from "../api/axiosClient";
import logoImg from '../assets/images/logo.png';

const { Title, Text } = Typography;

// --- CONSTANTS & STYLES ---
const PRIMARY_COLOR = '#2B4DFF';
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #2B4DFF 0%, #8752f3 100%)';
const INPUT_BG = '#F8FAFC';

const cssStyles = `
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .auth-modal-content { animation: slideUpFade 0.4s ease-out; }
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
  .ant-modal-content { padding: 0 !important; border-radius: 24px !important; overflow: hidden; }
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
  
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      form.resetFields();
      setCurrentStep(0);
    }
  }, [isOpen, initialView, form]);

  // --- MERGED LOGIC FROM LOGINPAGE ---
  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await axiosClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      // 1. Lưu thông tin (Theo cấu trúc bạn yêu cầu)
      if (res.token) {
        localStorage.setItem('token', res.token);
        const realName = res.fullName || res.full_name || res.username || "Học viên";
        localStorage.setItem('fullName', realName);
        localStorage.setItem('userId', res.userId || res.id);
        localStorage.setItem('user', JSON.stringify(res));

        message.success(`Chào mừng ${realName} quay trở lại!`);
        onClose();

        // 2. Logic điều hướng thông minh (Merged from LoginPage)
        if (res.role === 'ADMIN') {
          navigate('/admin');
        } else if (res.role === 'MENTOR') {
          navigate('/mentor');
        } else {
          if (res.isTested !== true) {
            navigate('/speaking-test');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      await axiosClient.post("/auth/register", values);
      message.success("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
      setView("LOGIN");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD HANDLERS ---
  const handleSendOtp = async (values: { email: string }) => {
    setLoading(true);
    try {
      await axiosClient.post("/auth/forgot-password", { email: values.email });
      setResetEmail(values.email);
      message.success("Mã OTP đã được gửi!");
      setView("VERIFY_OTP");
      setCurrentStep(1);
    } catch (error) { message.error("Email không tồn tại."); }
    setLoading(false);
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setLoading(true);
    try {
      const res: any = await axiosClient.post("/auth/verify-otp", { email: resetEmail, otp: values.otp });
      setResetToken(res.token);
      message.success("Xác thực thành công!");
      setView("RESET_PASSWORD");
      setCurrentStep(2);
    } catch (error) { message.error("OTP không chính xác."); }
    setLoading(false);
  };

  const handleResetPassword = async (values: { password: string }) => {
    setLoading(true);
    try {
      await axiosClient.post("/auth/reset-password", { token: resetToken, newPassword: values.password });
      message.success("Mật khẩu đã được đổi thành công!");
      setView("LOGIN");
    } catch (error) { message.error("Lỗi đổi mật khẩu."); }
    setLoading(false);
  };

  // --- REUSABLE STYLES ---
  const btnPrimaryStyle: React.CSSProperties = {
    height: '50px', borderRadius: '12px', background: PRIMARY_GRADIENT,
    border: 'none', fontWeight: 600, fontSize: '16px',
    boxShadow: '0 8px 20px rgba(43, 77, 255, 0.25)',
  };

  const AuthHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div style={{ background: 'linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)', padding: '40px 30px 20px', textAlign: 'center', borderBottom: '1px solid #F1F5F9' }}>
      <img src={logoImg} alt="Logo" style={{ height: 50, marginBottom: 15 }} />
      <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0F172A', fontSize: '26px' }}>{title}</Title>
      <Text style={{ fontSize: '15px', color: '#64748B', marginTop: 5, display: 'block' }}>{subtitle}</Text>
    </div>
  );

  return (
    <>
      <style>{cssStyles}</style>
      <Modal
        open={isOpen} onCancel={onClose} footer={null} width={450} centered
        closable={false} maskClosable={false}
      >
        <div onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, zIndex: 100, cursor: 'pointer', background: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>✕</div>
        
        {view === "LOGIN" && (
          <div className="auth-modal-content">
            <AuthHeader title="Chào mừng trở lại!" subtitle="Cùng AESP chinh phục tiếng Anh" />
            <div style={{ padding: '30px' }}>
              <Form layout="vertical" onFinish={handleLogin} size="large">
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: "Email không hợp lệ" }]}>
                  <Input prefix={<MailOutlined />} placeholder="Email của bạn" className="custom-input" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: "Nhập mật khẩu" }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" className="custom-input" />
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                  <a onClick={() => setView("FORGOT_EMAIL")} style={{ color: PRIMARY_COLOR, fontWeight: 600 }}>Quên mật khẩu?</a>
                </div>
                <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Đăng nhập</Button>
              </Form>
              <Divider plain><Text type="secondary" style={{ fontSize: 12 }}>HOẶC</Text></Divider>
              <Space direction="vertical" style={{ width: '100%' }}>
                 <Button icon={<GoogleOutlined />} block style={{ borderRadius: 12, height: 45 }}>Tiếp tục với Google</Button>
              </Space>
              <div style={{ textAlign: 'center', marginTop: 25 }}>
                <Text>Chưa có tài khoản? <a onClick={() => setView("REGISTER")} style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>Đăng ký ngay</a></Text>
              </div>
            </div>
          </div>
        )}

        {view === "REGISTER" && (
          <div className="auth-modal-content">
            <AuthHeader title="Tạo tài khoản" subtitle="Học thử miễn phí ngay hôm nay" />
            <div style={{ padding: '30px' }}>
              <Form layout="vertical" onFinish={handleRegister} size="large">
                <Form.Item name="fullName" rules={[{ required: true, message: "Nhập họ tên" }]}>
                  <Input prefix={<UserOutlined />} placeholder="Họ và tên" className="custom-input" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input prefix={<MailOutlined />} placeholder="Email" className="custom-input" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" className="custom-input" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Đăng ký ngay</Button>
              </Form>
              <div style={{ textAlign: 'center', marginTop: 25 }}>
                <Text>Đã có tài khoản? <a onClick={() => setView("LOGIN")} style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>Đăng nhập</a></Text>
              </div>
            </div>
          </div>
        )}

        {(view === "FORGOT_EMAIL" || view === "VERIFY_OTP" || view === "RESET_PASSWORD") && (
          <div className="auth-modal-content">
            <div style={{ padding: '40px 30px 20px', textAlign: 'center' }}>
               <Title level={3}>Khôi phục mật khẩu</Title>
               <Steps current={currentStep} size="small" items={[{ title: 'Mail' }, { title: 'OTP' }, { title: 'Mới' }]} style={{ marginTop: 20 }} />
            </div>
            <div style={{ padding: '0 30px 40px' }}>
              {view === "FORGOT_EMAIL" && (
                <Form onFinish={handleSendOtp} size="large">
                  <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder="Nhập email của bạn" className="custom-input" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Gửi mã OTP</Button>
                </Form>
              )}
              {view === "VERIFY_OTP" && (
                <Form onFinish={handleVerifyOtp} size="large">
                  <Form.Item name="otp" rules={[{ required: true, len: 6 }]}>
                    <Input placeholder="Mã OTP 6 số" className="custom-input" style={{ textAlign: 'center', letterSpacing: 8, fontSize: 20 }} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Xác thực</Button>
                </Form>
              )}
              {view === "RESET_PASSWORD" && (
                <Form onFinish={handleResetPassword} size="large">
                  <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password placeholder="Mật khẩu mới" className="custom-input" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block style={btnPrimaryStyle} loading={loading}>Hoàn tất</Button>
                </Form>
              )}
              <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => setView("LOGIN")} block style={{ marginTop: 15, color: '#64748B' }}>Quay lại</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AuthModal;