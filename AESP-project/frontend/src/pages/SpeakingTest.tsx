
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/speaking-test.css";

// ... (Giữ nguyên hàm shuffleArray và các interface của bạn)
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

interface WordResult { word: string; accuracyScore: number; errorType: string; }
interface AssessmentResult { level: string; overallScore: number; feedback: string; accuracyScore: number; fluencyScore: number; completenessScore: number; words: WordResult[]; }
interface PartResult { audioFile: File; previewUrl: string; aiResult?: AssessmentResult; }

const SpeakingTest = () => {
    const [texts, setTexts] = useState<any[]>([]);
    const [currentPart, setCurrentPart] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tempResults, setTempResults] = useState<Record<number, PartResult>>({});
    const [aiResult, setAiResult] = useState<any | null>(null);
    const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
    const [fillCorrect, setFillCorrect] = useState<Record<number, boolean>>({});
    const [fillScore, setFillScore] = useState<Record<number, number>>({});
    
    const recorderRef = useRef<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        axiosClient.get('/test-questions').then(res => {
            if (Array.isArray(res)) { setTexts(shuffleArray(res)); } 
            else { setTexts([]); }
        }).catch(() => setTexts([]));
    }, []);

    const TOTAL_PARTS = texts.length;

    // ... (Giữ nguyên hàm startRecording và stopRecording của bạn)
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const RecordRTC = (await import('recordrtc')).default;
            const recorder = new RecordRTC(stream, {
                type: 'audio', mimeType: 'audio/wav', recorderType: RecordRTC.StereoAudioRecorder,
                desiredSampRate: 16000, numberOfAudioChannels: 1
            });
            recorder.startRecording();
            recorderRef.current = recorder;
            setIsRecording(true);
        } catch (err) { alert("Không thể truy cập Microphone."); }
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stopRecording(async () => {
                const blob = recorderRef.current.getBlob();
                const previewUrl = URL.createObjectURL(blob);
                const audioFile = new File([blob], `part_${currentPart}.wav`, { type: "audio/wav" });
                setIsRecording(false);
                setLoading(true);
                try {
                    const form = new FormData();
                    form.append("file", audioFile, `part_${currentPart}.wav`);
                    form.append("text", texts[currentPart - 1].content);
                    const res = await axiosClient.post("/speech/assess", form);
                    const resultData: AssessmentResult = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;
                    setTempResults(prev => ({ ...prev, [currentPart]: { audioFile, previewUrl, aiResult: resultData } }));
                } catch (err) { alert("Lỗi khi chấm điểm."); } finally { setLoading(false); }
            });
        }
    };

    const submitAllAndFinish = async () => {
        const readCount = texts.filter(t => t.type === "read").length;
        const completedParts = Object.values(tempResults).filter(res => res && res.aiResult).length;
        if (completedParts < readCount) {
            alert(`Bạn cần ghi âm đủ ${readCount} phần đọc.`);
            return;
        }

        setIsProcessing(true);
        try {
            // --- GIỮ NGUYÊN LOGIC TÍNH ĐIỂM CỦA BẠN ---
            let totalScore = 0;
            let feedbacks: string[] = [];
            Object.values(tempResults).forEach((partData) => {
                if (partData && partData.aiResult) {
                    totalScore += partData.aiResult.overallScore || 0;
                    feedbacks.push(partData.aiResult.feedback);
                }
            });

            let fillTotal = 0;
            texts.forEach((t, idx) => {
                if (t.type === "fill") { fillTotal += fillScore[idx + 1] === 1 ? 10 : 0; }
            });

            const avgSpeaking = Math.round(totalScore / (readCount || 1));
            const totalFinal = avgSpeaking + fillTotal;

            let mainLevel = "A1";
            if (totalFinal >= 95) mainLevel = "C1";
            else if (totalFinal >= 80) mainLevel = "B2";
            else if (totalFinal >= 60) mainLevel = "B1";
            else if (totalFinal >= 40) mainLevel = "A2";

            const mainFeedback = feedbacks.length > 0 ? feedbacks[0] : "Cần luyện tập thêm.";
            setAiResult({ avgScore: totalFinal, mainLevel, mainFeedback });

            // 1. GỌI API LƯU VÀO SQL (Hàm mới tạo ở TestQuestionController)
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            await axiosClient.post('/test-questions/submit-result', {
                email: storedUser.email,
                level: mainLevel
            });

            // 2. CẬP NHẬT LẠI LOCALSTORAGE ĐỂ KHÔNG BỊ QUAY LẠI TRANG TEST
            const updatedUser = { ...storedUser, isTested: true, level: mainLevel };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // 3. GỌI PROFILE SETUP NHƯ CŨ
            await axiosClient.post('/profile/setup', {
                currentLevel: mainLevel,
                assessmentScore: totalFinal,
                dailyTime: 20,
                interestTopicIds: [],
                mainGoalId: null,
                packageId: null
            });

            setTimeout(() => { navigate("/dashboard"); }, 1500); // Chuyển về Dashboard thay vì setup để kiểm tra
        } catch (err: any) {
            alert("Có lỗi xảy ra khi gửi kết quả.");
        } finally {
            setIsProcessing(false);
        }
    };

    // ... (Toàn bộ phần Return bên dưới giữ nguyên 100% code của bạn)
    if (texts.length === 0) return <div className="container">Đang tải câu hỏi...</div>;
    const currentText = texts[currentPart - 1];
    const currentResult = tempResults[currentPart];

    return (
        <div className="container">
            <h2 className="title">Kiểm tra xếp bậc</h2>
            <p className="subtitle">Hoàn thành các phần để nhận phân tích trình độ từ AI.</p>
            <div className="progress-header">
                <span>Tiến độ bài làm</span>
                <span>{Object.keys(tempResults).length} / {TOTAL_PARTS}</span>
            </div>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${(Object.keys(tempResults).length / TOTAL_PARTS) * 100}%` }} />
            </div>
            <div className="tabs">
                {texts.map((t, idx) => (
                    <button key={idx + 1} className={`tab ${currentPart === idx + 1 ? "active" : ""}`} onClick={() => setCurrentPart(idx + 1)}>
                        {idx + 1} {(tempResults[idx + 1] || fillCorrect[idx + 1]) && "✓"}
                    </button>
                ))}
            </div>
            {currentText.type === "read" ? (
                <>
                    <div className="reading-box">
                        <div className="reading-title">Đoạn văn (Câu {currentPart}):</div>
                        <p>{currentText.content}</p>
                    </div>
                    <div className="record-box">
                        <p>{isRecording ? "Đang ghi âm..." : "Nhấn nút để bắt đầu đọc"}</p>
                        <button className={`record-btn ${isRecording ? "recording" : ""}`} onClick={isRecording ? stopRecording : startRecording} disabled={isProcessing || loading}>
                            {isRecording ? "⏹ Dừng & Chấm điểm" : "🎤 Bắt đầu ghi âm"}
                        </button>
                        {loading && <p style={{ color: '#4f46e5', fontWeight: 'bold', marginTop: '10px' }}>⏳ AI đang phân tích...</p>}
                    </div>
                    {currentResult?.aiResult && !isRecording && (
                        <div className="answer-result-section">
                            <h3 style={{ textAlign: 'center', color: currentResult.aiResult.overallScore >= 80 ? '#16a34a' : '#dc2626' }}>
                                {currentResult.aiResult.level} - {Math.round(currentResult.aiResult.overallScore)}/100
                            </h3>
                            <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#64748b' }}>"{currentResult.aiResult.feedback}"</p>
                            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '15px 0', fontSize: '14px' }}>
                                <span>Accuracy: <b>{Math.round(currentResult.aiResult.accuracyScore)}</b></span>
                                <span>Fluency: <b>{Math.round(currentResult.aiResult.fluencyScore)}</b></span>
                                <span>Completeness: <b>{Math.round(currentResult.aiResult.completenessScore)}</b></span>
                            </div>
                            <div className="words-display-container">
                                {currentResult.aiResult.words.map((w, i) => (
                                    <span key={i} className={`word-item ${w.errorType !== "None" ? 'word-error' : 'word-none'}`}>{w.word}</span>
                                ))}
                            </div>
                            <div className="audio-player-wrapper" style={{ marginTop: '15px' }}>
                                <audio src={currentResult.previewUrl} controls style={{ width: '100%' }} />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="record-box">
                    <div className="reading-title">Điền từ vào chỗ trống ({currentText.level}):</div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        const userAns = (fillAnswers[currentPart] || '').trim().toLowerCase();
                        const isCorrect = userAns === currentText.answer.trim().toLowerCase();
                        setFillCorrect(prev => ({ ...prev, [currentPart]: isCorrect }));
                        setFillScore(prev => ({ ...prev, [currentPart]: isCorrect ? 1 : 0 }));
                        alert(isCorrect ? 'Chính xác! +10 điểm' : 'Chưa chính xác, hãy thử lại.');
                    }}>
                        <p style={{ fontSize: '1.2rem' }}>
                            {currentText.content.split('___')[0]}
                            <input type="text" value={fillAnswers[currentPart] || ''} onChange={e => setFillAnswers(prev => ({ ...prev, [currentPart]: e.target.value }))} style={{ width: 100, borderBottom: '2px solid #4f46e5', borderTop: 'none', borderLeft: 'none', borderRight: 'none', textAlign: 'center', outline: 'none', fontSize: '1.2rem' }} disabled={fillCorrect[currentPart]} />
                            {currentText.content.split('___')[1]}
                        </p>
                        <button type="submit" className="record-btn" style={{ marginTop: 20 }}>Kiểm tra</button>
                    </form>
                </div>
            )}
            <div className="nav" style={{ marginTop: 30 }}>
                <button className="btn-back" disabled={currentPart === 1 || isProcessing} onClick={() => setCurrentPart(p => p - 1)}>← Trước</button>
                {currentPart < TOTAL_PARTS ? (
                    <button className="btn-next" disabled={isProcessing} onClick={() => setCurrentPart(p => p + 1)}>Tiếp theo →</button>
                ) : (
                    <button className="btn-next" onClick={submitAllAndFinish} disabled={isProcessing} style={{ background: "#10b981" }}>
                        {isProcessing ? "Đang xử lý..." : "🚀 Hoàn thành bài Test"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SpeakingTest;