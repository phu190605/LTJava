
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gamification.css';
import './GamificationDashboard.css';

// Định nghĩa kiểu dữ liệu cho thử thách và stats
interface Challenge {
    id: number;
    title: string;
    description: string;
    type: string;
    targetValue: number;
    xpReward: number;
    completed?: boolean; // thêm trường này để nhận từ backend
}



interface GamificationStats {
    currentStreak: number;
    totalXp: number;
}



const GamificationDashboard: React.FC = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizResult, setQuizResult] = useState<{ correct: number, xp: number } | null>(null);
    const [totalXp, setTotalXp] = useState<number>(0);
    const [currentChallengeId, setCurrentChallengeId] = useState<number | null>(null);

    // Lấy tổng XP của user
    const fetchTotalXp = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!userId) return setTotalXp(0);
            const res = await axios.get(`http://localhost:8080/api/gamification/stats/${userId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });
            setTotalXp(res.data?.totalXp || 0);
        } catch (e) {
            setTotalXp(0);
        }
    };
    // Nếu vẫn muốn giữ stats, có thể lấy từ API khác hoặc bỏ phần này nếu không cần
    // const [stats, setStats] = useState<GamificationStats>({ currentStreak: 0, totalXp: 0 });

    // Lấy danh sách thử thách từ API /api/challenge
    const fetchChallenges = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const res = await axios.get(`http://localhost:8080/api/challenge?userId=${userId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });
            setChallenges(res.data || []);
        } catch (error) {
            console.error('Lỗi khi tải thử thách:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
        fetchTotalXp();
    }, []);



    if (loading) return <div>Đang tải dữ liệu thử thách...</div>;

    return (
        <div className="gamification-dashboard-bg">
            <div className="gamification-dashboard-container">
                <div className="xp-bar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginRight: 10 }}>
                        <path d="M12 2L2 9l10 13 10-13-10-7z" stroke="#1890ff" strokeWidth="2.5" fill="none" />
                    </svg>
                    <span className="xp-label">XP:</span>
                    <span className="xp-value">{totalXp}</span>
                </div>
                <h2 className="challenge-title">Danh sách thử thách</h2>
                {challenges.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>Không có thử thách nào.</p>
                ) : (
                    <div className="challenge-list">
                        {challenges.map((item) => (
                            <div key={item.id} className={`challenge-item-modern${item.completed ? ' completed' : ''}`}>
                                <div className="challenge-header-modern">
                                    <span>{item.title}</span>
                                </div>
                                <div className="challenge-desc">{item.description}</div>
                                <div className="challenge-meta">
                                    <span>Loại: <b>{item.type}</b></span>
                                    <span>Mục tiêu: <b>{item.targetValue}</b></span>
                                    <span>XP: <b style={{ color: '#1890ff' }}>{item.xpReward}</b></span>
                                </div>
                                <button
                                    className="btn-test-modern"
                                    disabled={item.completed}
                                    onClick={async () => {
                                        if (item.completed) return;
                                        setQuizResult(null);
                                        setShowQuiz(true);
                                        setCurrentChallengeId(item.id);
                                        const token = localStorage.getItem('token');
                                        const res = await axios.get(`http://localhost:8080/api/vocab-challenge/questions?type=${encodeURIComponent(item.type)}`, {
                                            headers: {
                                                Authorization: token ? `Bearer ${token}` : ''
                                            }
                                        });
                                        setQuestions(res.data || []);
                                        setAnswers({});
                                    }}
                                >{item.completed ? 'Đã hoàn thành' : 'Chọn'}</button>
                            </div>
                        ))}
                    </div>
                )}
                {/* Hiển thị quiz nếu có */}
                {showQuiz && questions.length > 0 && (
                    <div className="quiz-container-modern">
                        <h3>Làm bài tập từ vựng (5 câu)</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const token = localStorage.getItem('token');
                            const userId = localStorage.getItem('userId');
                            if (!currentChallengeId) return;
                            const res = await axios.post(
                                `http://localhost:8080/api/vocab-challenge/submit?userId=${userId}&challengeId=${currentChallengeId}`,
                                answers,
                                {
                                    headers: {
                                        Authorization: token ? `Bearer ${token}` : ''
                                    }
                                }
                            );
                            setQuizResult(res.data);
                            fetchTotalXp();
                            // Cập nhật lại danh sách thử thách để disable nút
                            fetchChallenges();
                        }}>
                            {questions.map((q, idx) => {
                                const choices = q.choices ? q.choices.split(',') : null;
                                return (
                                    <div key={q.id} className="quiz-question-modern">
                                        <div className="quiz-q-title"><b>Câu {idx + 1}:</b> {q.question}</div>
                                        {choices && choices.length > 0 ? (
                                            <div className="quiz-choices-modern">
                                                {choices.map((choice: string) => (
                                                    <label key={choice} className="quiz-choice-label">
                                                        <input
                                                            type="radio"
                                                            name={`answer_${q.id}`}
                                                            value={choice}
                                                            checked={answers[q.id] === choice}
                                                            onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                                                            required
                                                        /> {choice}
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                value={answers[q.id] || ''}
                                                onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                                                className="quiz-input-modern"
                                                required
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            <button type="submit" className="btn-test-modern">Nộp bài</button>
                        </form>
                        {quizResult && (
                            <div className="quiz-result-modern">
                                <b>Kết quả:</b> Đúng {quizResult.correct}/5 câu, nhận {quizResult.xp} XP!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GamificationDashboard;