import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../styles/speaking-test.css";

const TOTAL_PARTS = 5;
const texts = [
    { title: "Phần 1", content: "Hello, my name is John. I enjoy learning new languages because it helps me connect with people from different cultures." },
    { title: "Phần 2", content: "In this section, we will discuss the basics of JavaScript, including variables, functions, and loops." },
    { title: "Phần 3", content: "Finally, practice is key. Working on small projects helps reinforce learning and develop problem-solving skills." },
    { title: "Phần 4", content: "I enjoy spending time outdoors, going for walks in the park, and observing nature. It helps me relax." },
    { title: "Phần 5", content: "In the future, I hope to travel to different countries to experience various cultures and improve my skills." }
];

interface PartResult {
    audioFile: File;
    previewUrl: string;
}

const SpeakingTest = () => {
    const navigate = useNavigate();
    const [currentPart, setCurrentPart] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tempResults, setTempResults] = useState<Record<number, PartResult>>({});

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = async () => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(streamRef.current);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];
            
            recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const previewUrl = URL.createObjectURL(blob);
                const audioFile = new File([blob], `part_${currentPart}.webm`, { type: "audio/webm" });

                setTempResults(prev => ({
                    ...prev,
                    [currentPart]: { audioFile, previewUrl }
                }));
                streamRef.current?.getTracks().forEach((t) => t.stop());
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            alert("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const submitAllAndFinish = async () => {
        const completedParts = Object.keys(tempResults).length;
        if (completedParts < TOTAL_PARTS) {
            alert(`Bạn cần ghi âm đủ ${TOTAL_PARTS} phần (Hiện tại: ${completedParts}/5).`);
            return;
        }

        setIsProcessing(true);
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (!user?.id) return alert("Vui lòng đăng nhập!");

            for (let i = 1; i <= TOTAL_PARTS; i++) {
                const data = tempResults[i];
                const form = new FormData();
                form.append("audio", data.audioFile);
                form.append("partNumber", String(i));
                form.append("userId", String(user.id));
                await axiosClient.post("/speaking", form);
            }

            alert("Hoàn thành! Kết quả của bạn đã được cập nhật vào SQL.");
            navigate("/dashboard");
        } catch (err) {
            alert("Lỗi khi nộp bài. Vui lòng thử lại.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container">
            <h2 className="title">Đánh Giá Trình Độ Tự Động</h2>
            <p className="subtitle">Hoàn thành ghi âm 5 phần để nhận kết quả phân tích.</p>
            
            <div className="progress-header">
                <span>Tiến độ bài làm</span>
                <span>{Object.keys(tempResults).length} / {TOTAL_PARTS}</span>
            </div>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${(Object.keys(tempResults).length / TOTAL_PARTS) * 100}%` }} />
            </div>

            <div className="tabs">
                {[1, 2, 3, 4, 5].map((p) => (
                    <button 
                        key={p} 
                        className={`tab ${currentPart === p ? "active" : ""}`} 
                        onClick={() => setCurrentPart(p)}
                    >
                        P{p} {tempResults[p] && "✓"}
                    </button>
                ))}
            </div>

            <div className="reading-box">
                <div className="reading-title">Đoạn văn phần {currentPart}:</div>
                <p>{texts[currentPart - 1].content}</p>
            </div>

            <div className="record-box">
                <p>{isRecording ? "Đang ghi âm..." : "Nhấn nút để bắt đầu đọc"}</p>
                <button 
                    className={`record-btn ${isRecording ? "recording" : ""}`} 
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                >
                    {isRecording ? "⏹ Dừng & Lưu" : "🎤 Bắt đầu ghi âm"}
                </button>

                {tempResults[currentPart] && !isRecording && (
                    <div className="audio-player-wrapper">
                        <audio className="audio-player" src={tempResults[currentPart].previewUrl} controls />
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default SpeakingTest;