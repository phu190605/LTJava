import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col, Radio, Button, Steps, Divider, message, Spin, Space, Image } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, CheckCircleOutlined, BankOutlined, QrcodeOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { packageId } = useParams(); // Lấy ID gói từ URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [packageInfo, setPackageInfo] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('momo');

  // Lấy thông tin gói cước để hiển thị
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res: any = await axiosClient.get('/subscription/packages');
        // Tìm gói trùng với ID trên URL
        const found = res.find((p: any) => p.packageId === Number(packageId));
        if (found) {
          setPackageInfo(found);
        } else {
          message.error('Gói dịch vụ không tồn tại!');
          navigate('/subscription');
        }
      } catch (error) {
        console.error(error);
        message.error('Lỗi tải thông tin gói');
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetails();
  }, [packageId, navigate]);

  // Xử lý khi bấm Thanh Toán
  const handleConfirmPayment = async () => {
    setProcessing(true);
    try {
      // Gọi API nâng cấp (Backend bạn đã viết trước đó)
      await axiosClient.post('/subscription/upgrade', {
        packageId: Number(packageId)
      });
      
      message.success('Thanh toán thành công!');
      // Chuyển hướng sang trang kết quả
      navigate('/payment-success', { state: { packageId: Number(packageId) } });
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data || 'Thanh toán thất bại, vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 30 }}>
        <Steps
          current={1}
          items={[
            { title: 'Chọn gói', icon: <ShoppingCartOutlined /> },
            { title: 'Thanh toán', icon: <CreditCardOutlined /> },
            { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
          ]}
        />
      </div>

      <Row gutter={24}>
        {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN */}
        <Col xs={24} md={14}>
          <Card title="Phương thức thanh toán" style={{ borderRadius: 8, marginBottom: 20 }}>
           <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} style={{ width: '100%' }}>
  <Space direction="vertical" style={{ width: '100%' }}>
    
    {/* 1. VÍ MOMO */}
    <div style={{ padding: 15, border: '1px solid #d9d9d9', borderRadius: 8, background: '#fff' }}>
      <Radio value="momo">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <QrcodeOutlined style={{ fontSize: 24, color: '#d0021b', marginRight: 15 }} />
          <div>
            <Text strong>Ví MoMo</Text><br/>
            <Text type="secondary" style={{ fontSize: 12 }}>Quét mã QR để thanh toán ngay</Text>
          </div>
        </div>
      </Radio>
      
      {/* Logic hiện mã QR MoMo */}
      {paymentMethod === 'momo' && (
        <div style={{ marginTop: 15, textAlign: 'center', borderTop: '1px dashed #eee', paddingTop: 15 }}>
            <Text type="secondary" style={{display: 'block', marginBottom: 10}}>Quét mã này bằng ứng dụng MoMo:</Text>
            {/* Đây là link ảnh QR mẫu, bạn có thể thay bằng link ảnh thật của bạn */}
            <Image 
                width={200}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                alt="MoMo QR"
            />
            <div style={{marginTop: 10, fontWeight: 'bold', color: '#d0021b'}}>
                Nội dung: MUA GOI {packageInfo?.packageName}
            </div>
        </div>
      )}
    </div>

    {/* 2. CHUYỂN KHOẢN NGÂN HÀNG */}
    <div style={{ padding: 15, border: '1px solid #d9d9d9', borderRadius: 8, background: '#fff' }}>
      <Radio value="banking">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BankOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 15 }} />
          <div>
            <Text strong>Chuyển khoản Ngân hàng</Text><br/>
            <Text type="secondary" style={{ fontSize: 12 }}>VietQR - Xử lý tự động 24/7</Text>
          </div>
        </div>
      </Radio>

      {/* Logic hiện mã QR Ngân hàng */}
      {paymentMethod === 'banking' && (
         <div style={{ marginTop: 15, textAlign: 'center', borderTop: '1px dashed #eee', paddingTop: 15 }}>
            <Text type="secondary" style={{display: 'block', marginBottom: 10}}>Quét mã bằng App Ngân hàng:</Text>
            {/* Sử dụng dịch vụ tạo VietQR tự động (img.vietqr.io) */}
            <Image 
                width={250}
                // Link này sẽ tự tạo QR theo số tiền và nội dung. Bạn thay số tài khoản thật vào nhé.
                src={`https://img.vietqr.io/image/MB-0000000000-compact2.png?amount=${packageInfo?.price}&addInfo=THANHTOAN%20AESP&accountName=HO%20GIA%20KHANH`}
                alt="Banking QR"
            />
         </div>
      )}
    </div>

  </Space>
</Radio.Group>
          </Card>
        </Col>

        {/* CỘT PHẢI: THÔNG TIN ĐƠN HÀNG */}
        <Col xs={24} md={10}>
          <Card 
            title="Tóm tắt đơn hàng" 
            style={{ borderRadius: 8, background: '#fafafa' }}
            actions={[
              <div style={{ padding: '0 24px' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  onClick={handleConfirmPayment}
                  loading={processing}
                  style={{ height: 50, fontSize: 18, fontWeight: 'bold' }}
                >
                  Thanh toán ngay
                </Button>
                <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>
                  Bằng việc thanh toán, bạn đồng ý với điều khoản sử dụng.
                </div>
              </div>
            ]}
          >
            {packageInfo && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text type="secondary">Gói dịch vụ:</Text>
                  <Text strong>{packageInfo.packageName}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text type="secondary">Thời hạn:</Text>
                  <Text>{packageInfo.durationMonths * 30} ngày</Text>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={5} style={{ margin: 0 }}>Tổng thanh toán:</Title>
                  <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(packageInfo.price)}
                  </Title>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;