import React, { useEffect, useState } from 'react';
import { Card, Radio, Button, Tag, Select, Slider, Spin } from 'antd';
import axiosClient from '../api/axiosClient';

interface Props {
  onSubmit: (data: any) => void;
  onBack: () => void;
  loading?: boolean;
}

const PreferenceSetup: React.FC<Props> = ({ onSubmit, onBack, loading }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState<number>(1);
  const [level, setLevel] = useState<string>('A1'); // Mặc định A1
  const [time, setTime] = useState<number>(15);     // Mặc định 15p
  const [fetching, setFetching] = useState(true);

  // 1. Lấy danh sách gói cước
  useEffect(() => {
    axiosClient.get('/service-packages')
      .then(res => {
        setPackages(Array.isArray(res) ? res : []);
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, []);

  const handleSubmit = () => {
    // 2. Gom đủ 3 dữ liệu còn thiếu để gửi Backend
    onSubmit({
      packageId: selectedPkgId,
      currentLevel: level,
      dailyTime: time
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>3. Thiết lập lộ trình & Gói học</h3>
      
      {/* Chọn Trình độ (Bổ sung cho đủ API) */}
      <Card title="Trình độ hiện tại của bạn" size="small" style={{marginBottom: 16}}>
        <Select value={level} onChange={setLevel} style={{width: '100%'}}>
           <Select.Option value="A1">Beginner (A1)</Select.Option>
           <Select.Option value="A2">Elementary (A2)</Select.Option>
           <Select.Option value="B1">Intermediate (B1)</Select.Option>
           <Select.Option value="B2">Upper Intermediate (B2)</Select.Option>
        </Select>
      </Card>

      {/* Chọn Thời gian học (Bổ sung cho đủ API) */}
      <Card title={`Mục tiêu học: ${time} phút/ngày`} size="small" style={{marginBottom: 16}}>
        <Slider min={5} max={60} step={5} value={time} onChange={setTime} />
      </Card>

      {/* Chọn Gói cước (Lấy từ API) */}
      <h4>Chọn gói dịch vụ:</h4>
      {fetching ? <Spin /> : (
        <Radio.Group value={selectedPkgId} onChange={e => setSelectedPkgId(e.target.value)} style={{ width: '100%' }}>
          {packages.map((pkg: any) => (
            <Card key={pkg.id} style={{ marginBottom: 12 }} hoverable onClick={() => setSelectedPkgId(pkg.id)}>
              <Radio value={pkg.id}>
                <span style={{ fontWeight: 'bold' }}>{pkg.packageName}</span>
                {pkg.price > 0 && <Tag color="gold" style={{ marginLeft: 8 }}>{pkg.price.toLocaleString()}đ</Tag>}
              </Radio>
              <p style={{ marginLeft: 24, margin: '5px 0 0', color: '#666' }}>{pkg.description}</p>
            </Card>
          ))}
        </Radio.Group>
      )}

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onBack}>Quay lại</Button>
        <Button type="primary" size="large" onClick={handleSubmit} loading={loading}>
          HOÀN TẤT SETUP
        </Button>
      </div>
    </div>
  );
};

export default PreferenceSetup;