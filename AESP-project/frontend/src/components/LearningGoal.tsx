import React, { useEffect, useState } from 'react';
import { Button, Spin, message } from 'antd';
import axiosClient from '../api/axiosClient';
import './LearningGoal.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

const LearningGoal: React.FC<Props> = ({ onNext }) => {
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Dùng để điều hướng về Dashboard

  // 1. Gọi API lấy danh sách Goal từ Backend
  useEffect(() => {
    axiosClient.get('/profile/goals')
      .then(res => {
        setGoals(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(() => {
        message.error("Không tải được danh sách mục tiêu");
        setLoading(false);
      });
  }, []);

  const handleContinue = () => {
    if (selectedGoalId) {
      // Tìm goal object để lấy code
      const selectedGoal = goals.find(g => g.goalId === selectedGoalId);
      const goalCode = selectedGoal?.goalCode || selectedGoal?.goalName?.toUpperCase() || 'CAREER';
      
      onNext({ 
        mainGoalId: selectedGoalId,
        learningGoal: goalCode // Gửi thêm goal code để lưu vào localStorage
      });
    }
  };

  // 3. Thoát về Dashboard
  const handleExitToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="goal-container">
      <img src="https://cdn-icons-png.flaticon.com/512/921/921356.png" alt="Mascot" className="goal-mascot" />
      <div className="goal-title">Tại sao bạn muốn học tiếng Anh?</div>

      {loading ? <Spin size="large" style={{ marginTop: 50 }} /> : (
        <div className="goal-grid">
          {goals.map((item: any) => (
            <div
              key={item.goalId}
              className={`goal-card ${selectedGoalId === item.goalId ? 'selected' : ''}`}
              onClick={() => setSelectedGoalId(item.goalId)}
            >
              {item.iconUrl ? (
                <img src={item.iconUrl} alt="icon" style={{ width: 32, height: 32, marginBottom: 10 }} />
              ) : (
                <span className="goal-icon">🎯</span>
              )}
              <span className="goal-text">{item.goalName}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
        {/* Nút thoát: điều hướng thẳng về Dashboard */}
        <Button onClick={handleExitToDashboard} className="back-btn">Thoát</Button>
        <Button
          type="primary" block className="continue-btn"
          disabled={!selectedGoalId}
          onClick={handleContinue}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};

export default LearningGoal;