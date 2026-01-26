import React, { useEffect, useState } from 'react';
import { Card, Radio, Button, Tag, Select, Slider, Spin, message } from 'antd';
import axiosClient from '../api/axiosClient';

interface Props {
  onSubmit: (data: any) => void;
  onBack: () => void;
  loading?: boolean;
}

const PreferenceSetup: React.FC<Props> = ({ onSubmit, onBack, loading }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState<number>(1);
  const [level, setLevel] = useState<string>('A1'); 
  const [time, setTime] = useState<number>(15);    
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      try {
        /**
         * FIX LỖI 404 & ĐỒNG BỘ: 
         * 1. Đảm bảo Backend đã có endpoint /api/auth/me
         * 2. Truy xuất vào .data của Axios response để tránh lỗi undefined
         */
        const [userRes, pkgsRes]: any = await Promise.all([
          axiosClient.get('/auth/me'),
          axiosClient.get('/profile/packages')
        ]);

        // SỬA TẠI ĐÂY: Truy cập vào .data
        const userData = userRes.data || userRes; 
        const pkgsData = pkgsRes.data || pkgsRes;

        if (userData && userData.level) {
          setLevel(userData.level);
          console.log("Đồng bộ trình độ thành công:", userData.level);
        }

        setPackages(Array.isArray(pkgsData) ? pkgsData : []);
        
        // Tự động chọn gói đầu tiên nếu danh sách có dữ liệu
        if (Array.isArray(pkgsData) && pkgsData.length > 0) {
          setSelectedPkgId(pkgsData[0].packageId);
        }

      } catch (error: any) {
        // Log lỗi chi tiết ra console để kiểm tra status code
        console.error("Lỗi chi tiết tại PreferenceSetup dòng 40:", error);
        
        if (error.response?.status === 404) {
          message.error("Không tìm thấy API xác thực (404). Vui lòng kiểm tra Backend.");
        } else if (error.response?.status === 401) {
          message.warning("Phiên đăng nhập hết hạn, vui lòng login lại.");
        } else {
          message.error("Không thể kết nối dữ liệu hệ thống.");
        }
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = () => {
    onSubmit({
      packageId: selectedPkgId,
      currentLevel: level,
      dailyTime: time
    });
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin tip="Đang kết nối dữ liệu trình độ A1..." size="large">
          <div style={{ padding: '50px' }} />
        </Spin>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 20 }}>3. Thiết lập lộ trình & Gói học</h3>

      <Card 
        title="Trình độ học tập hiện tại" 
        size="small" 
        style={{ marginBottom: 16, border: '1px solid #91d5ff', background: '#e6f7ff' }}
      >
        <Select value={level} onChange={setLevel} style={{ width: '100%' }}>
          <Select.Option value="A1">Beginner (A1)</Select.Option>
          <Select.Option value="A2">Elementary (A2)</Select.Option>
          <Select.Option value="B1">Intermediate (B1)</Select.Option>
          <Select.Option value="B2">Upper Intermediate (B2)</Select.Option>
        </Select>
        <div style={{ marginTop: 8, fontSize: '12px', color: '#1890ff' }}>
          * Hệ thống tự động nhận diện bạn đang ở mức: <strong>{level}</strong>
        </div>
      </Card>

      <Card title={`Thời gian học: ${time} phút/ngày`} size="small" style={{ marginBottom: 16 }}>
        <Slider min={5} max={60} step={5} value={time} onChange={setTime} />
      </Card>

      <h4>Chọn gói dịch vụ học tập:</h4>
      {packages.length === 0 ? (
        <p>Đang tải danh sách gói cước...</p>
      ) : (
        <Radio.Group 
          value={selectedPkgId} 
          onChange={e => setSelectedPkgId(e.target.value)} 
          style={{ width: '100%' }}
        >
          {packages.map((pkg: any) => (
            <Card 
              key={pkg.packageId} 
              style={{ 
                marginBottom: 12,
                border: selectedPkgId === pkg.packageId ? '2px solid #1890ff' : '1px solid #f0f0f0',
                borderRadius: '8px'
              }} 
              hoverable 
              onClick={() => setSelectedPkgId(pkg.packageId)}
            >
              <Radio value={pkg.packageId}>
                <span style={{ fontWeight: 'bold' }}>{pkg.packageName}</span>
                {pkg.price > 0 && (
                  <Tag color="gold" style={{ marginLeft: 8 }}>
                    {pkg.price.toLocaleString()}đ
                  </Tag>
                )}
              </Radio>
              <p style={{ marginLeft: 24, margin: '5px 0 0', color: '#666', fontSize: '13px' }}>
                {pkg.description}
              </p>
            </Card>
          ))}
        </Radio.Group>
      )}

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Quay lại</Button>
        <Button 
          type="primary" 
          size="large" 
          onClick={handleSubmit} 
          loading={loading}
          disabled={packages.length === 0}
        >
          HOÀN TẤT SETUP
        </Button>
      </div>
    </div>
  );
};

export default PreferenceSetup;