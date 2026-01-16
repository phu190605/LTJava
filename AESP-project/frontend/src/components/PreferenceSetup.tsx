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
  const [selectedPkgId, setSelectedPkgId] = useState<number>(0); // Mặc định 0 để bắt buộc chọn
  const [level, setLevel] = useState<string>('A1'); // Mặc định A1
  const [time, setTime] = useState<number>(15);     // Mặc định 15p
  const [fetching, setFetching] = useState(true);

  // 1. Lấy danh sách gói cước
  useEffect(() => {
    axiosClient.get('/subscription/packages') // Đảm bảo đúng API lấy gói
      .then((res: any) => {
        // Xử lý nếu API trả về { data: [...] } hoặc [...]
        const data = Array.isArray(res) ? res : (res.data || []);
        setPackages(data);
        
        // Tự động chọn gói đầu tiên nếu có
        if (data.length > 0) {
            setSelectedPkgId(data[0].packageId);
        }
        setFetching(false);
      })
      .catch((err) => {
          console.error(err);
          setFetching(false);
      });
  }, []);

  const handleSubmit = () => {
    if (!selectedPkgId) {
        message.error("Vui lòng chọn một gói dịch vụ!");
        return;
    }

    // --- LOGIC QUAN TRỌNG CẦN SỬA Ở ĐÂY ---
    // 1. Tìm object gói cước dựa trên ID đang chọn
    const selectedPackage = packages.find(p => p.packageId === selectedPkgId);
    
    // 2. Lấy giá tiền (Nếu không tìm thấy thì mặc định là 0)
    const price = selectedPackage ? selectedPackage.price : 0;

    // 3. Gửi cả packageId VÀ price ra ngoài cho trang cha xử lý
    onSubmit({
      packageId: selectedPkgId,
      currentLevel: level,
      dailyTime: time,
      price: price // <--- QUAN TRỌNG: Để trang cha biết là Free hay Trả phí
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>3. Thiết lập lộ trình & Gói học</h3>

      {/* Chọn Trình độ */}
      <Card title="Trình độ hiện tại của bạn" size="small" style={{ marginBottom: 16 }}>
        <Select value={level} onChange={setLevel} style={{ width: '100%' }}>
          <Select.Option value="A1">Beginner (A1) </Select.Option>
          <Select.Option value="A2">Elementary (A2)</Select.Option>
          <Select.Option value="B1">Intermediate (B1)</Select.Option>
          <Select.Option value="B2">Upper Intermediate (B2)</Select.Option>
        </Select>
      </Card>

      {/* Chọn Thời gian học */}
      <Card title={`Mục tiêu học: ${time} phút/ngày`} size="small" style={{ marginBottom: 16 }}>
        <Slider 
            min={5} 
            max={60} 
            step={5} 
            value={time} 
            onChange={setTime} 
            marks={{ 5: '5p', 15: '15p', 30: '30p', 60: '60p' }}
        />
      </Card>

      {/* Chọn Gói cước */}
      <h4>Chọn gói dịch vụ phù hợp:</h4>
      {fetching ? <div style={{textAlign: 'center', padding: 20}}><Spin /></div> : (
        <Radio.Group value={selectedPkgId} onChange={e => setSelectedPkgId(e.target.value)} style={{ width: '100%' }}>
          {packages.map((pkg: any) => (
            <Card 
                key={pkg.packageId} 
                style={{ 
                    marginBottom: 12, 
                    border: selectedPkgId === pkg.packageId ? '1px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedPkgId === pkg.packageId ? '#e6f7ff' : '#fff'
                }} 
                hoverable 
                onClick={() => setSelectedPkgId(pkg.packageId)}
            >
              <Radio value={pkg.packageId} style={{width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>{pkg.packageName}</span>
                    {pkg.price > 0 ? (
                        <Tag color="gold" style={{ fontSize: 14, padding: '4px 10px' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                        </Tag>
                    ) : (
                        <Tag color="green">Miễn phí</Tag>
                    )}
                </div>
              </Radio>
              <p style={{ marginLeft: 30, margin: '5px 0 0', color: '#666' }}>{pkg.description}</p>
            </Card>
          ))}
        </Radio.Group>
      )}

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Quay lại</Button>
        <Button type="primary" size="large" onClick={handleSubmit} loading={loading}>
          {loading ? 'Đang xử lý...' : 'HOÀN TẤT & BẮT ĐẦU'}
        </Button>
      </div>
    </div>
  );
};

export default PreferenceSetup;