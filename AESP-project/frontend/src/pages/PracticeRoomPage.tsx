import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Input, message, Typography, Space } from 'antd';
import { AudioOutlined, SendOutlined, DownCircleOutlined, CommentOutlined, BulbOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';

// Import thư viện ghi âm
import { MediaRecorder as ExtendableMediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

const { TextArea } = Input;

type Message = {
  id: string;
  from: 'user' | 'ai' | 'system';
  text: string;
};

export default function PracticeRoomPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<any | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  
  // 👇 State mới: Lưu câu mẫu mà AI đề xuất
  const [targetSentence, setTargetSentence] = useState<string>('');
  
  // 👇 State mới: Lưu lịch sử tất cả câu mẫu đã dùng
  const [sentenceHistory, setSentenceHistory] = useState<string[]>([]);

  const mediaRecorderRef = useRef<any>(null); 
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const initWavEncoder = async () => {
        try { await register(await connect()); } catch (e) { }
    };
    initWavEncoder();

    setMessages([
      { id: 'welcome', from: 'system', text: 'Chào mừng! Bấm "Lấy mẫu câu" để AI ra đề bài cho bạn đọc.' },
    ]);

    return () => {
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      window.speechSynthesis.cancel();
    };
  }, []);

  const appendMessage = (m: Message) => setMessages((prev) => [...prev, m]);

  const speak = (text: string, onEndCallback?: () => void) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'en-US';
        ut.onend = () => { if (onEndCallback) onEndCallback(); };
        ut.onerror = () => { if (onEndCallback) onEndCallback(); };
        window.speechSynthesis.speak(ut);
      } else {
        if (onEndCallback) onEndCallback();
      }
    } catch (e) {
      if (onEndCallback) onEndCallback();
    }
  };

  // 👇 Hàm mới: Xin AI một câu mẫu (dùng endpoint tối ưu /sentences/practice)
  const getSampleSentence = async () => {
    const typingId = 'typing';
    appendMessage({ id: typingId, from: 'system', text: 'AI đang tìm mẫu câu...' });

    try {
        // Gọi endpoint sentence service (DB cache + AI fallback)
        // Truyền sentenceHistory để tránh lặp lại các câu trước
        const response = await axiosClient.get('/sentences/practice', {
            params: { 
                topic: 'Daily life', 
                level: 'BEGINNER',
                forceAI: false, // Dùng cache DB nếu có
                excludedSentences: sentenceHistory.join('|||') // Tránh lặp lại câu trước
            }
        });
        const sentence = response.data.sentence;
        const source = response.data.source;
        
        setMessages((prev) => prev.filter((m) => m.id !== typingId));
        
        // Lưu câu mẫu vào state để lát nữa chấm điểm
        setTargetSentence(sentence);
        
        // Thêm câu vào lịch sử
        setSentenceHistory((prev) => [...prev, sentence]);
        
        const sourceText = source === 'AI' ? ' (mới tạo)' : ' (từ kho)';
        appendMessage({ id: uuidv4(), from: 'ai', text: `📖 Hãy đọc câu này: "${sentence}"${sourceText}` });
        speak(sentence); // AI đọc mẫu trước

    } catch (e) {
        console.error(e);
        setMessages((prev) => prev.filter((m) => m.id !== typingId));
        message.error("Lỗi khi lấy mẫu câu.");
    }
  };

  const sendText = async (txt: string) => {
    if (!txt || txt.trim() === '') return;
    const content = txt.trim();
    
    appendMessage({ id: uuidv4(), from: 'user', text: content });
    setInput('');

    const typingId = 'typing';
    appendMessage({ id: typingId, from: 'system', text: 'AI đang phản hồi...' });

    try {
      const response = await axiosClient.post('/chat/ask', { message: content });
      const aiText = response.data || '...';

      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      appendMessage({ id: uuidv4(), from: 'ai', text: aiText });
      
      speak(aiText, () => {
        if (autoMode) {
          setTimeout(() => startLiveRecognition(), 500);
        }
      });

    } catch (err: any) {
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      if (autoMode) setAutoMode(false);
    }
  };

  const startLiveRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') return; 

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setRecording(true);
    
    rec.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      sendText(text);
    };

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech' && autoMode) setAutoMode(false);
      setRecording(false);
    };

    rec.onend = () => setRecording(false);
    rec.start();
  };

  const handleRecordedBlob = async (blob: Blob) => {
    try {
        setTranscribing(true);
        const form = new FormData();
        form.append('file', blob, 'record.wav'); 
        
        // 1. Transcribe
        const res = await axiosClient.post('/speech/transcribe', form, { 
             headers: { 'Content-Type': 'multipart/form-data' },
        });
        const transcribed: string = res.data;
        
        appendMessage({ id: uuidv4(), from: 'user', text: transcribed });
        
        // 2. Chấm điểm (Assess)
        const assessForm = new FormData();
        assessForm.append('file', blob, 'record.wav');
        
        // 👇 QUAN TRỌNG: Nếu có câu mẫu (targetSentence), gửi nó lên để so sánh
        // Nếu không có, dùng chính văn bản nhận diện được (transcribed) để tự chấm chính nó
        const referenceText = targetSentence && targetSentence.length > 0 ? targetSentence : transcribed;
        assessForm.append('text', referenceText);
        
        const assessRes = await axiosClient.post('/speech/assess', assessForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const assessment = assessRes.data;
        setLastAssessment(assessment);
        
        let feedbackMsg = `🎯 Điểm: ${assessment.overallScore?.toFixed(0)}/100`;
        if (targetSentence) {
            feedbackMsg += ` (So với mẫu: "${targetSentence}")`;
            // Reset câu mẫu sau khi chấm xong để lần sau nói tự do
            setTargetSentence(''); 
        }

        appendMessage({
            id: uuidv4(),
            from: 'system',
            text: feedbackMsg,
        });

        // Nếu không phải đang luyện mẫu câu thì mới gửi cho Chat AI trả lời tiếp
        if (!targetSentence) {
             await sendText(transcribed);
        }

    } catch (e) {
        console.error(e);
        message.error('Lỗi xử lý audio.');
    } finally {
        setTranscribing(false);
    }
  };

  const startRecordingWav = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const mr = new ExtendableMediaRecorder(stream, { mimeType: 'audio/wav' });
        chunksRef.current = [];
        mr.ondataavailable = (e: any) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = async () => { 
            setRecording(false); 
            const blob = new Blob(chunksRef.current, { type: 'audio/wav' }); 
            await handleRecordedBlob(blob); 
        };
        mr.start();
        mediaRecorderRef.current = mr;
        setRecording(true);
      } catch(e) { console.error(e); }
  };

  const stopRecordingWav = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
  };
  
  const toggleAutoConversation = () => {
    if (autoMode) {
        setAutoMode(false);
        window.speechSynthesis.cancel();
        message.info("Đã dừng chế độ hội thoại.");
    } else {
        setAutoMode(true);
        // Khi bật chế độ hội thoại, xóa câu mẫu đi để nói tự do
        setTargetSentence('');
        message.success("Bắt đầu hội thoại. Hãy nói gì đó!");
        startLiveRecognition();
    }
  };

  return (
    <Card style={{ maxWidth: 900, margin: '20px auto' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Luyện nói AI</h2>
        <Space>
            {/* 👇 Nút lấy mẫu câu mới */}
            <Button icon={<BulbOutlined />} onClick={getSampleSentence} disabled={recording || autoMode}>
                Lấy mẫu câu
            </Button>
            <Button 
                type={autoMode ? "primary" : "default"} 
                danger={autoMode}
                icon={<CommentOutlined />}
                onClick={toggleAutoConversation}
            >
                {autoMode ? "Dừng rảnh tay" : "Rảnh tay"}
            </Button>
        </Space>
      </div>

      {/* 👇 Hiển thị câu mẫu to rõ để đọc */}
      {targetSentence && (
          <div style={{ margin: '15px 0', padding: '15px', background: '#e6f7ff', border: '1px dashed #1890ff', borderRadius: 8, textAlign: 'center' }}>
              <div style={{fontSize: 12, color: '#666', marginBottom: 5}}>Hãy bấm Mic và đọc to câu sau:</div>
              <div style={{fontSize: 20, fontWeight: 'bold', color: '#0050b3'}}>{targetSentence}</div>
          </div>
      )}

      <div style={{ minHeight: 240, maxHeight: 420, overflowY: 'auto', padding: 12, border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 12, background: '#fafafa' }}>
        {messages.map((item) => (
          <div key={item.id} style={{ marginBottom: 12, textAlign: item.from === 'user' ? 'right' : 'left' }}>
            <div style={{ 
                display: 'inline-block',
                padding: '8px 12px', 
                borderRadius: 8, 
                background: item.from === 'user' ? '#1890ff' : (item.from === 'ai' ? '#fff' : '#eee'),
                color: item.from === 'user' ? '#fff' : '#333',
                border: item.from === 'ai' ? '1px solid #ddd' : 'none',
                maxWidth: '80%'
            }}>
                <div style={{fontWeight: 'bold', fontSize: 10, marginBottom: 2, opacity: 0.8}}>
                    {item.from === 'user' ? 'Bạn' : (item.from === 'ai' ? 'AI' : 'Hệ thống')}
                </div>
                {item.text}
            </div>
          </div>
        ))}
      </div>

      <Space style={{ marginTop: 12, width: '100%' }}>
        <TextArea rows={2} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập tin nhắn..." />
      </Space>

      <Space style={{ marginTop: 12, flexWrap: 'wrap' }}>
        <Button type="primary" icon={<SendOutlined />} onClick={() => sendText(input)} disabled={!input.trim()}>Gửi</Button>
        
        <Button 
            type={recording && !autoMode ? 'default' : 'dashed'} 
            danger={recording && !autoMode} 
            icon={<AudioOutlined />} 
            onClick={() => (recording ? stopRecordingWav() : startRecordingWav())}
            disabled={autoMode} 
        >
          {recording && !autoMode ? 'Dừng ghi âm' : transcribing ? 'Đang chấm điểm...' : 'Đọc & Chấm điểm'}
        </Button>

        <Button onClick={() => startLiveRecognition()} icon={<DownCircleOutlined />} disabled={autoMode || recording}>
            Chat nhanh
        </Button>

        <Button onClick={() => window.speechSynthesis.cancel()}>Tắt tiếng</Button>
      </Space>

      {lastAssessment && (
        <Card style={{ marginTop: 14, background: '#f6ffed', borderColor: '#b7eb8f' }}>
          <h3>📝 Kết quả phát âm</h3>
          <div>Đánh giá: <b>{lastAssessment.level}</b> - Điểm số: <b style={{fontSize: 18, color: 'green'}}>{lastAssessment.overallScore?.toFixed(0)}/100</b></div>
          <div style={{ marginTop: 8 }}>
            {lastAssessment.words && lastAssessment.words.map((w: any, idx: number) => (
                <span key={idx} style={{ 
                  display: 'inline-block', marginRight: 6, marginBottom: 6, padding: '2px 6px', borderRadius: 4,
                  fontSize: 16,
                  background: w.accuracyScore >= 80 ? '#d9f7be' : w.accuracyScore >= 60 ? '#fff1b8' : '#ffccc7',
                  color: w.accuracyScore < 60 ? '#cf1322' : 'inherit',
                  textDecoration: w.accuracyScore < 60 ? 'underline' : 'none'
                }} title={`Score: ${w.accuracyScore} - Error: ${w.errorType}`}>
                  {w.word}
                </span>
              ))}
          </div>
        </Card>
      )}
    </Card>
  );
}