
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo đã chạy: npm install axios
import './Gamification.css';

// Định nghĩa kiểu dữ liệu cho thử thách và stats
interface Challenge {
    id: number;
    title: string;
    description: string;
    type: string;
    targetValue: number;
    xpReward: number;
}

interface ChallengeProgress {
    id: number;
    challenge: Challenge;
    currentValue: number;
    claimed: boolean;
}

interface GamificationStats {
    currentStreak: number;
    totalXp: number;
}


const GamificationDashboard: React.FC = () => {
    // Hardcode User ID = 1 để test. Sau này lấy từ Context/Login
    const userId = 1;

    const [stats, setStats] = useState<GamificationStats>({ currentStreak: 0, totalXp: 0 });
    const [challenges, setChallenges] = useState<ChallengeProgress[]>([]);
    const [loading, setLoading] = useState(true);

    // Hàm gọi API lấy dữ liệu
    const fetchData = async () => {
        try {
            // Gọi song song 2 API để lấy Stats và Challenges
            const [statsRes, challengesRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/gamification/stats/${userId}`),
                axios.get(`http://localhost:8080/api/gamification/challenges/${userId}`)
            ]);

            setStats(statsRes.data || { currentStreak: 0, totalXp: 0 });
            setChallenges(challengesRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setLoading(false);
        }
    };

    // Gọi API khi component vừa hiện lên
    useEffect(() => {
        fetchData();
    }, []);

    // Hàm giả lập hành động học bài (Nói 5 phút)
    const handleSimulateLearning = async () => {
        try {
            // Giả lập nói 5 phút
            await axios.post(`http://localhost:8080/api/gamification/simulate-speaking?userId=${userId}&minutes=5`);
            alert("Đã hoàn thành bài luyện nói 5 phút! 🎉");
            // Refresh lại dữ liệu để thấy thanh tiến độ tăng
            fetchData();
        } catch (error) {
            alert("Lỗi kết nối server!");
        }
    };

    if (loading) return <div>Đang tải dữ liệu game...</div>;

    return (
        <div className="gamification-container">
            <h2>Hồ sơ học tập</h2>

            {/* --- PHẦN 1: STATS CARD (STREAK & XP) --- */}
            <div className="stats-card">
                <div className="stat-item">
                    <div className="stat-value fire-icon">
                        🔥 {stats.currentStreak}
                    </div>
                    <div className="stat-label">Chuỗi ngày (Streak)</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value xp-icon">
                        ⭐ {stats.totalXp}
                    </div>
                    <div className="stat-label">Tổng XP</div>
                </div>
            </div>

            {/* --- PHẦN 2: LIST THỬ THÁCH (CHALLENGES) --- */}
            <h3>Nhiệm vụ hôm nay</h3>
            {challenges.length === 0 ? (
                <p>Chưa có nhiệm vụ nào được kích hoạt.</p>
            ) : (
                challenges.map((item: ChallengeProgress) => {
                    const target = item.challenge.targetValue;
                    const current = item.currentValue;
                    // Tính phần trăm: (current / target) * 100
                    const percent = Math.min((current / target) * 100, 100);
                    const isDone = item.claimed;

                    return (
                        <div key={item.id} className="challenge-item">
                            <div className="challenge-header">
                                <span>{item.challenge.title}</span>
                                <span>
                                    {isDone ? "Đã nhận ✅" : `${current} / ${target} ${item.challenge.type === 'SPEAKING_TIME' ? 'phút' : ''}`}
                                </span>
                            </div>
                            {/* Thanh Progress Bar */}
                            <div className="progress-container">
                                <div
                                    className={`progress-bar ${isDone ? 'completed' : ''}`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                            <small style={{ color: '#7f8c8d' }}>
                                {item.challenge.description} (+{item.challenge.xpReward} XP)
                            </small>
                        </div>
                    );
                })
            )}

            {/* Nút Test giả lập */}
            <button className="btn-test" onClick={handleSimulateLearning}>
                🎤 Giả lập: Luyện nói 5 phút
            </button>
        </div>
    );
};

export default GamificationDashboard;