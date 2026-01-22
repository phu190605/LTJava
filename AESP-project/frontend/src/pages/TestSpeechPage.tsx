import React, { useState, useRef } from 'react';
import axios from 'axios';
import RecordRTC from 'recordrtc'; // Import thư viện mới
import '../App.css';

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

const TestSpeechPage: React.FC = () => {
  const [referenceText, setReferenceText] = useState<string>(
    "Hello world. I am learning to speak English properly."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);

  // --- BẮT ĐẦU GHI ÂM ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Cấu hình ghi âm chuẩn WAV
      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav', // Ép buộc định dạng WAV
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000, // Azure thích tần số 16000Hz
        numberOfAudioChannels: 1 
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setIsRecording(true);
      setResult(null); // Reset kết quả cũ
    } catch (err) {
      console.error("Lỗi micro:", err);
      alert("Không thể truy cập Micro!");
    }
  };

  // --- DỪNG GHI ÂM ---
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);

        // Gửi file đi chấm điểm ngay
        handleAssess(blob);
      });
    }
  };

  const handleAssess = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Đặt tên file .wav để backend nhận diện đúng
      formData.append("file", audioBlob, "recording.wav"); 
      formData.append("text", referenceText);

      const response = await axios.post<AssessmentResult>(
        "http://localhost:8080/api/speech/assess", 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResult(response.data);
    } catch (error: any) {
      console.error("Lỗi:", error);
      alert("Lỗi chấm điểm: " + (error.response?.data?.message || "Kiểm tra lại Backend Java!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>🗣️ Kiểm tra phát âm (AESP)</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Đoạn văn mẫu:</label>
        <textarea 
          rows={3}
          value={referenceText}
          onChange={(e) => setReferenceText(e.target.value)}
          style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px' }}
        />
      </div>

      <div className="recorder-box" style={{ margin: '20px 0' }}>
        {!isRecording ? (
          <button 
            onClick={startRecording}
            style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '50px' }}
          >
            🎙️ Bắt đầu Ghi Âm
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '50px' }}
          >
            ⏹️ Dừng & Chấm điểm
          </button>
        )}
      </div>

      {audioUrl && <div style={{ margin: '20px' }}><audio src={audioUrl} controls /></div>}
      {loading && <p style={{ color: '#1976d2', fontWeight: 'bold' }}>⏳ Đang chấm điểm...</p>}

      {/* HIỂN THỊ KẾT QUẢ */}
      {result && (
        <div className="result-box" style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', textAlign: 'left' }}>
          <h2 style={{ textAlign: 'center', color: result.overallScore >= 80 ? 'green' : '#d32f2f' }}>
            {result.level} - {Math.round(result.overallScore)}/100
          </h2>
          <p style={{ textAlign: 'center' }}><i>"{result.feedback}"</i></p>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            <div>Accuracy: <strong>{Math.round(result.accuracyScore)}</strong></div>
            <div>Fluency: <strong>{Math.round(result.fluencyScore)}</strong></div>
            <div>Completeness: <strong>{Math.round(result.completenessScore)}</strong></div>
          </div>

          <div style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
            {result.words.map((w, i) => (
              <span key={i} style={{ 
                color: w.errorType !== "None" ? '#d32f2f' : '#2e7d32', 
                margin: '0 5px', fontWeight: w.errorType !== "None" ? 'bold' : 'normal',
                textDecoration: w.errorType !== "None" ? 'underline' : 'none' 
              }}>
                {w.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSpeechPage;