import React, { useEffect, useState } from 'react';
import { Button, Spin, message } from 'antd';
import axiosClient from '../api/axiosClient';
import './GoalSelection.css';

interface Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

const GoalSelection: React.FC<Props> = ({ onNext, onBack }) => {
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Gọi API lấy danh sách Topic
  useEffect(() => {
    axiosClient.get('/profile/topics')
      .then(res => {
        setTopics(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(() => {
        message.error("Lỗi tải chủ đề");
        setLoading(false);
      });
  }, []);

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(t => t !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="setup-container">
      <div className="mascot-area">
        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="Mascot" className="mascot-img" />
      </div>
      <div className="setup-title">Sở thích của bạn là gì?</div>

      {loading ? <Spin style={{ marginTop: 40, color: 'white' }} /> : (
        <div className="options-grid">
          {topics.map((item: any) => (
            <div
              key={item.topicId}
              className={`option-card ${selectedIds.includes(item.topicId) ? 'selected' : ''}`}
              onClick={() => handleToggle(item.topicId)}
            >
              {/* Hiển thị ảnh từ Backend hoặc placeholder */}
              {item.iconUrl ? (
                <img src={item.iconUrl} alt="icon" style={{ width: 32, height: 32, marginBottom: 10 }} />
              ) : (
                <span className="goal-icon">🎯</span>
              )}
              <span className="goal-text">{item.topicName}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
        {/* Back: dùng class back-btn để đồng bộ style với LearningGoal */}
        <Button className="back-btn" onClick={onBack}>Quay lại</Button>
        {/* Continue: primary đồng bộ màu và trạng thái disabled */}
        <Button
          type="primary" className="continue-btn"
          onClick={() => {
            // Lấy topic code từ selected topics
            const selectedTopics = topics.filter(t => selectedIds.includes(t.topicId));
            const topicCode = selectedTopics.length > 0 
              ? (selectedTopics[0].topicCode || selectedTopics[0].topicName?.toUpperCase() || 'COOKING')
              : 'COOKING';
            
            onNext({ 
              interestTopicIds: selectedIds,
              interestTopicCode: topicCode // Gửi thêm topic code để lưu vào localStorage
            });
          }}
          disabled={selectedIds.length === 0}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};

export default GoalSelection;