import { useRef, useState } from "react";
import axiosClient from "../api/axiosClient";
import "../styles/speaking-test.css";





function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


interface WordResult {
    word: string;
    accuracyScore: number;
    errorType: string;
}

interface AssessmentResult {
    level: string;
    overallScore: number;
    feedback: string;
    accuracyScore: number;
    fluencyScore: number;
    completenessScore: number;
    words: WordResult[];
}

interface PartResult {
    audioFile: File;
    previewUrl: string;
    aiResult?: AssessmentResult;
}


import { useNavigate } from "react-router-dom";


import { useEffect } from "react";

const SpeakingTest = () => {
    const [texts, setTexts] = useState<any[]>([]);
    const [currentPart, setCurrentPart] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tempResults, setTempResults] = useState<Record<number, PartResult>>({});
    const [aiResult, setAiResult] = useState<any | null>(null); // Lưu kết quả AI tổng hợp
    const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
    const [fillCorrect, setFillCorrect] = useState<Record<number, boolean>>({});
    const [fillScore, setFillScore] = useState<Record<number, number>>({}); // 1: đúng, 0: sai
    const navigate = useNavigate();

    // Fetch questions from backend
    useEffect(() => {
        axiosClient.get('/test-questions').then(res => {
            if (Array.isArray(res)) {
                setTexts(shuffleArray(res));
            } else {
                setTexts([]);
            }
        }).catch(() => setTexts([]));
    }, []);

    const TOTAL_PARTS = texts.length;

    // --- Ghi âm và chấm điểm từng đoạn (chuẩn WAV, hiển thị AI từng từ) ---
    const [loading, setLoading] = useState(false);
    const recorderRef = useRef<any>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const RecordRTC = (await import('recordrtc')).default;
            const recorder = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/wav',
                recorderType: RecordRTC.StereoAudioRecorder,
                desiredSampRate: 16000,
                numberOfAudioChannels: 1
            });
            recorder.startRecording();
            recorderRef.current = recorder;
            setIsRecording(true);
        } catch (err) {
            alert("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt.");
        }
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
                    const aiResult: AssessmentResult = (res && typeof res === 'object' && 'level' in res && 'words' in res)
                        ? (res as unknown as AssessmentResult)
                        : (res && typeof res === 'object' && 'data' in res ? ((res as any).data as AssessmentResult) : (res as unknown as AssessmentResult));
                    setTempResults(prev => ({
                        ...prev,
                        [currentPart]: { audioFile, previewUrl, aiResult }
                    }));
                } catch (err) {
                    alert("Lỗi khi chấm điểm. Vui lòng thử lại.");
                } finally {
                    setLoading(false);
                }
            });
        }
    };


    const submitAllAndFinish = async () => {
        // Không bắt buộc đúng hết fill mới cho submit
        // 1. Kiểm tra ghi âm đủ chưa
        const readCount = texts.filter(t => t.type === "read").length;
        const completedParts = Object.values(tempResults).filter(res => res && res.aiResult).length;
        if (completedParts < readCount) {
            alert(`Bạn cần ghi âm đủ ${readCount} phần đọc (Hiện tại: ${completedParts}/${readCount}).`);
            return;
        }

        setIsProcessing(true);
        try {
            // --- TÍNH ĐIỂM ---
            let totalScore = 0;
            let feedbacks: string[] = [];

            // Điểm speaking (AI)
            Object.values(tempResults).forEach((partData) => {
                if (partData && partData.aiResult) {
                    totalScore += partData.aiResult.overallScore || 0;
                    feedbacks.push(partData.aiResult.feedback);
                }
            });

            // Điểm fill-in-the-blank
            let fillTotal = 0;
            let fillCount = 0;
            texts.forEach((t, idx) => {
                if (t.type === "fill") {
                    fillTotal += fillScore[idx + 1] === 1 ? 10 : 0; // đúng +10, sai +0
                    fillCount++;
                }
            });

            // Tổng điểm = điểm speaking trung bình + điểm fill
            const avgSpeaking = Math.round(totalScore / (readCount || 1));
            const totalFinal = avgSpeaking + fillTotal;

            // Phân level
            let mainLevel = "A1";
            if (totalFinal >= 95) mainLevel = "C1";
            else if (totalFinal >= 80) mainLevel = "B2";
            else if (totalFinal >= 60) mainLevel = "B1";
            else if (totalFinal >= 40) mainLevel = "A2";

            const mainFeedback = feedbacks.length > 0 ? feedbacks[0] : "Cần luyện tập thêm.";
            setAiResult({ avgScore: totalFinal, mainLevel, mainFeedback });

            // Gửi kết quả lên Profile
            await axiosClient.post('/profile/setup', {
                currentLevel: mainLevel,
                assessmentScore: totalFinal,
                dailyTime: 20,
                interestTopicIds: [],
                mainGoalId: null,
                packageId: null
            });

            setTimeout(() => {
                navigate("/setup");
            }, 1500);

        } catch (err: any) {
            console.error("CHI TIẾT LỖI:", err);
            const msg = err.response?.data?.message || err.message || "Lỗi không xác định";
            alert(`Có lỗi xảy ra: ${msg}`);
        } finally {
            setIsProcessing(false);
        }
    };


    if (texts.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: 60 }}>Đang tải câu hỏi...</div>;
    }

    return (
        <div className="container">
            <h2 className="title">Kiểm tra xếp bậc</h2>
            <p className="subtitle">Ghi âm từng đoạn văn mẫu để nhận phân tích AI chi tiết và tổng hợp trình độ.</p>
            <div className="progress-header">
                <span>Tiến độ bài làm</span>
                <span>{Object.keys(tempResults).length} / {TOTAL_PARTS}</span>
            </div>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${(Object.keys(tempResults).length / TOTAL_PARTS) * 100}%` }} />
            </div>

            <div className="tabs">
                {texts.map((t, idx) => (
                    <button
                        key={idx + 1}
                        className={`tab ${currentPart === idx + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPart(idx + 1)}
                    >
                        {/* Hiển thị số thứ tự thay vì level */}
                        {idx + 1} {(t.type === "read" && tempResults[Object.keys(tempResults).length >= idx + 1 ? idx + 1 : -1]) && "✓"}
                        {t.type === "fill" && fillCorrect[idx + 1] && "✓"}
                    </button>
                ))}
            </div>

            {/* Render câu hỏi: đọc hoặc điền từ */}
            {texts[currentPart - 1].type === "read" ? (
                <>
                    <div className="reading-box">
                        <div className="reading-title">Đoạn văn ({texts[currentPart - 1].type === 'read' ? `Câu ${currentPart}` : ''}):</div>
                        <p>{texts[currentPart - 1].content}</p>
                    </div>
                    <div className="record-box">
                        <p>{isRecording ? "Đang ghi âm..." : "Nhấn nút để bắt đầu đọc"}</p>
                        <button
                            className={`record-btn ${isRecording ? "recording" : ""}`}
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing || loading}
                        >
                            {isRecording ? "⏹ Dừng & Chấm điểm" : "🎤 Bắt đầu ghi âm"}
                        </button>
                        {loading && <div style={{ color: '#1976d2', fontWeight: 'bold', marginTop: 10 }}>⏳ Đang chấm điểm...</div>}
                        {tempResults[Object.keys(tempResults).length >= currentPart ? currentPart : -1] && !isRecording && (
                            <div className="audio-player-wrapper">
                                <audio className="audio-player" src={tempResults[currentPart]?.previewUrl} controls />
                            </div>
                        )}
                        {/* Hiển thị kết quả AI từng đoạn */}
                        {tempResults[currentPart]?.aiResult && (
                            <div className="result-box" style={{ marginTop: '20px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', textAlign: 'left' }}>
                                <h3 style={{ textAlign: 'center', color: tempResults[currentPart].aiResult.overallScore >= 80 ? 'green' : '#d32f2f' }}>
                                    {tempResults[currentPart].aiResult.level} - {Math.round(tempResults[currentPart].aiResult.overallScore)}/100
                                </h3>
                                <p style={{ textAlign: 'center' }}><i>"{tempResults[currentPart].aiResult.feedback}"</i></p>
                                <div style={{ display: 'flex', justifyContent: 'space-around', margin: '12px 0' }}>
                                    <div>Accuracy: <strong>{Math.round(tempResults[currentPart].aiResult.accuracyScore)}</strong></div>
                                    <div>Fluency: <strong>{Math.round(tempResults[currentPart].aiResult.fluencyScore)}</strong></div>
                                    <div>Completeness: <strong>{Math.round(tempResults[currentPart].aiResult.completenessScore)}</strong></div>
                                </div>
                                <div style={{ fontSize: '1.2rem', lineHeight: '1.7' }}>
                                    {tempResults[currentPart].aiResult.words.map((w: WordResult, i: number) => (
                                        <span key={i} style={{
                                            color: w.errorType !== "None" ? '#d32f2f' : '#2e7d32',
                                            margin: '0 4px', fontWeight: w.errorType !== "None" ? 'bold' : 'normal',
                                            textDecoration: w.errorType !== "None" ? 'underline' : 'none'
                                        }}>
                                            {w.word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // Fill-in-the-blank dạng Duolingo
                <div className="fill-blank-box" style={{ margin: '32px 0', textAlign: 'center' }}>
                    <div className="reading-title">Điền từ vào chỗ trống ({texts[currentPart - 1].level}):</div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            const userAns = (fillAnswers[currentPart] || '').trim().toLowerCase();
                            const correctAns = texts[currentPart - 1].answer.trim().toLowerCase();
                            const isCorrect = userAns === correctAns;
                            setFillCorrect(prev => ({ ...prev, [currentPart]: isCorrect }));
                            setFillScore(prev => ({ ...prev, [currentPart]: isCorrect ? 1 : 0 }));
                            if (isCorrect) {
                                alert('Chính xác! +10 điểm');
                            } else {
                                alert('Sai! -0 điểm. Bạn vẫn có thể tiếp tục.');
                            }
                        }}
                    >
                        <span style={{ fontSize: 20 }}>
                            {texts[currentPart - 1].content.split('___').length > 1
                                ? <>
                                    {texts[currentPart - 1].content.split('___')[0]}
                                    <input
                                        type="text"
                                        value={fillAnswers[currentPart] || ''}
                                        onChange={e => setFillAnswers(prev => ({ ...prev, [currentPart]: e.target.value }))}
                                        style={{ width: 80, fontSize: 18, margin: '0 8px', borderRadius: 6, border: '1px solid #ccc', padding: 4 }}
                                        disabled={fillCorrect[currentPart]}
                                    />
                                    {texts[currentPart - 1].content.split('___')[1]}
                                </>
                                : <>
                                    {texts[currentPart - 1].content.replace(/___/,
                                        <input
                                            type="text"
                                            value={fillAnswers[currentPart] || ''}
                                            onChange={e => setFillAnswers(prev => ({ ...prev, [currentPart]: e.target.value }))}
                                            style={{ width: 80, fontSize: 18, margin: '0 8px', borderRadius: 6, border: '1px solid #ccc', padding: 4 }}
                                            disabled={fillCorrect[currentPart]}
                                        />
                                    )}
                                </>}
                        </span>
                        <br />
                        <button
                            type="submit"
                            className="btn-next"
                            style={{ marginTop: 16 }}
                        // Cho phép kiểm tra lại nhiều lần, không disable
                        >
                            Kiểm tra
                        </button>
                        {fillCorrect[currentPart] && <span style={{ color: 'green', marginLeft: 12 }}>✔ Đúng</span>}
                    </form>
                </div>
            )}
            <div className="nav">
                <button
                    className="btn-back"
                    disabled={currentPart === 1 || isProcessing}
                    onClick={() => setCurrentPart(p => p - 1)}
                >
                    ← Trước
                </button>
                {currentPart < TOTAL_PARTS ? (
                    <button
                        className="btn-next"
                        disabled={isProcessing}
                        onClick={() => setCurrentPart(p => p + 1)}
                    >
                        Tiếp theo →
                    </button>
                ) : (
                    <button
                        className="btn-next btn-finish"
                        onClick={submitAllAndFinish}
                        disabled={isProcessing}
                        style={{ background: "#10b981" }}
                    >
                        {isProcessing ? "Đang gửi dữ liệu..." : "🚀 Hoàn thành bài Test"}
                    </button>
                )}
            </div>
            {/* Hiển thị kết quả AI tổng hợp sau khi hoàn thành */}
            {aiResult && (
                <div className="ai-result-box" style={{ marginTop: 32, textAlign: 'center' }}>
                    <h3>Kết quả xếp bậc AI tổng hợp</h3>
                    <p><b>Điểm trung bình:</b> {aiResult.avgScore} / 100</p>
                    <p><b>Trình độ:</b> {aiResult.mainLevel}</p>
                    <p><b>Nhận xét:</b> {aiResult.mainFeedback}</p>
                </div>
            )}
        </div>
    );
};

export default SpeakingTest;