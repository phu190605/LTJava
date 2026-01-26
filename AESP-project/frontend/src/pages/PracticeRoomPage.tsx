import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Avatar, Tooltip, Select, Progress, Popconfirm } from 'antd';
import { 
  Mic, Send, MessageSquare, Lightbulb, Bot, Volume2, 
  Loader2, Square, ChevronDown, User, Sparkles, BarChart3, Trash2
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

// Import thư viện ghi âm
import { MediaRecorder as ExtendableMediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

// --- CONFIG STYLES ---
const PRIMARY_GRADIENT = 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)'; 
const GLASS_BG = 'rgba(255, 255, 255, 0.7)';
const GLASS_BORDER = '1px solid rgba(255, 255, 255, 0.5)';
const SHADOW_LG = '0 10px 40px -10px rgba(0,0,0,0.1)';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: linear-gradient(135deg, #EEF2FF 0%, #FDF2F8 100%);
  }
  .chat-scroll-area::-webkit-scrollbar { width: 6px; }
  .chat-scroll-area::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll-area::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
  .chat-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }

  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(236, 72, 153, 0); }
    100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
  }
  .recording-active {
    animation: pulse-ring 2s infinite;
    background: #EC4899 !important;
    border-color: #EC4899 !important;
    color: white !important;
    transform: scale(1.1);
  }
  .bubble-user {
    background: ${PRIMARY_GRADIENT};
    color: white;
    border-radius: 20px 20px 4px 20px;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
  }
  .bubble-ai {
    background: white;
    color: #1e293b;
    border-radius: 20px 20px 20px 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }
  .glass-panel {
    background: ${GLASS_BG};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: ${GLASS_BORDER};
    box-shadow: ${SHADOW_LG};
  }
  .ant-select-selector {
    background-color: transparent !important;
    border: 1px solid rgba(79, 70, 229, 0.2) !important;
    border-radius: 12px !important;
    height: 36px !important;
    display: flex; align-items: center;
  }
  .ant-input-affix-wrapper {
    border-radius: 24px; border: 1px solid #E2E8F0; padding: 8px 16px; background: rgba(255,255,255,0.9);
  }
  .ant-input-affix-wrapper:hover, .ant-input-affix-wrapper:focus-within {
    border-color: #4F46E5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

type MessageType = {
  id: string;
  from: 'user' | 'ai' | 'system';
  text: string;
};

interface Topic {
    topicId: number;
    topicName: string;
    topicCode: string;
    description: string;
    iconUrl: string;
    category: string;
}

export default function PracticeRoomPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [lastAssessment, setLastAssessment] = useState<any | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  
  const [targetSentence, setTargetSentence] = useState<string>('');
  const [sentenceHistory, setSentenceHistory] = useState<string[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const mediaRecorderRef = useRef<any>(null); 
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoModeRef = useRef(false); 
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'BEGINNER' | 'INTERMEDIATE'>('BEGINNER');

  // Khởi tạo và tải danh sách Topic
  useEffect(() => {
    const initWavEncoder = async () => {
        try { await register(await connect()); } catch (e) { }
    };
    initWavEncoder();
    
    axiosClient.get('/topics')
      .then(res => {
        // res đã được bóc từ axiosClient interceptor
        const data = Array.isArray(res) ? res : (res as any).data;
        if (data && data.length > 0) {
            setTopics(data);
            setSelectedTopic(data[0]);
        }
      })
      .catch(err => console.error("Lỗi tải topics:", err));

    return () => {
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      window.speechSynthesis.cancel();
    };
  }, []);

  // --- LOGIC TẢI LỊCH SỬ CHAT ---
  useEffect(() => {
    if (selectedTopic) {
        setMessages([]); 
        
        axiosClient.get(`/chat-history/${selectedTopic.topicId}`)
            .then(res => {
                const data = Array.isArray(res) ? res : (res as any).data;
                if (data && data.length > 0) {
                    const mappedMessages = data.map((m: any) => ({
                        id: m.id.toString(),
                        from: m.sender,
                        text: m.text
                    }));
                    setMessages(mappedMessages);
                } else {
                    setMessages([{ id: 'welcome', from: 'system', text: `Bắt đầu luyện tập chủ đề: ${selectedTopic.topicName}` }]);
                }
            })
            .catch(err => console.error("Lỗi tải lịch sử chat:", err));
        
        setTargetSentence(''); 
    }
  }, [selectedTopic, selectedLevel]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, lastAssessment, targetSentence]);

  // --- HÀM LƯU TIN NHẮN VÀO DB ---
  const saveMessageToDB = async (text: string, sender: 'user' | 'ai') => {
      if (!selectedTopic) return;
      try {
          await axiosClient.post('/chat-history', {
            topicId: selectedTopic.topicId,
            text: text,
            sender: sender
          });
      } catch (e) {
          console.error("Lỗi lưu tin nhắn:", e);
      }
  };

  // --- HÀM XÓA LỊCH SỬ ---
  const handleClearHistory = async () => {
      if (!selectedTopic) return;
      try {
        await axiosClient.delete(`/chat-history/${selectedTopic.topicId}`);
        setMessages([]); 
        message.success("Đã xóa lịch sử trò chuyện!");
      } catch (e) {
          console.error(e);
          message.error("Lỗi khi xóa lịch sử.");
      }
  };

  const speak = (text: string, onEndCallback?: () => void) => {
    window.speechSynthesis.cancel(); 
    if (!text) { if (onEndCallback) onEndCallback(); return; }
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'en-US';
    utteranceRef.current = ut;
    ut.onend = () => { utteranceRef.current = null; if (onEndCallback) onEndCallback(); };
    ut.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') { console.error("❌ TTS Error:", e); } utteranceRef.current = null; if (onEndCallback) onEndCallback(); };
    window.speechSynthesis.speak(ut);
  };

  const getSampleSentence = async () => {
    const typingId = 'typing';
    setMessages(prev => prev.some(m => m.id === typingId) ? prev : [...prev, { id: typingId, from: 'system', text: 'Đang tạo mẫu câu mới...' }]);
    setLastAssessment(null);
    try {
        let res: any = await axiosClient.get('/sentences/practice', {
            params: { topic: selectedTopic?.topicName || 'Daily Life', level: selectedLevel, forceAI: false, excludedSentences: sentenceHistory.join('|||') }
        });
        
        // Nếu không có câu trả về, thử gọi lại với forceAI=true
        if (!res?.sentence) {
            res = await axiosClient.get('/sentences/practice', {
                params: { topic: selectedTopic?.topicName || 'Daily Life', level: selectedLevel, forceAI: true, excludedSentences: sentenceHistory.join('|||') }
            });
        }
        
        setMessages(prev => prev.filter(m => m.id !== typingId));
        if (res?.sentence) {
            setTargetSentence(res.sentence);
            setSentenceHistory(prev => [...prev, res.sentence]);
            if (autoModeRef.current) {
                setRecording(false);
                speak(res.sentence, () => {
                    if (autoModeRef.current) setTimeout(() => startLiveRecognition(), 300);
                });
            } else {
                speak(res.sentence);
            }
        } else {
            message.error("Không lấy được câu mẫu.");
        }
    } catch (e) {
        setMessages(prev => prev.filter(m => m.id !== typingId));
        message.error("Không lấy được câu mẫu.");
    }
  };

  const sendText = async (txt: string) => {
    if (!txt.trim()) return;
    const content = txt.trim();
    
    setMessages(prev => [...prev, { id: uuidv4(), from: 'user', text: content }]);
    setInput('');
    saveMessageToDB(content, 'user');

    const typingId = 'typing-ai';
    setMessages(prev => prev.some(m => m.id === typingId) ? prev : [...prev, { id: typingId, from: 'system', text: 'AI đang suy nghĩ...' }]);

    try {
      const topicContext = selectedTopic ? `[Topic: ${selectedTopic.topicName}] ` : "";
      const res: any = await axiosClient.post('/chat/ask', { message: `${topicContext} ${content}` });
      setMessages(prev => prev.filter(m => m.id !== typingId));
      const aiText = typeof res === 'string' ? res : res.data;
      
      setMessages(prev => [...prev, { id: uuidv4(), from: 'ai', text: aiText }]);
      saveMessageToDB(aiText, 'ai');

      speak(aiText, () => { 
          if (autoModeRef.current) setTimeout(() => startLiveRecognition(), 2000);
      });
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      message.error("Lỗi kết nối AI");
      setAutoMode(false); autoModeRef.current = false;
    }
  };

  const startLiveRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return message.error("Trình duyệt không hỗ trợ");
    if (mediaRecorderRef.current?.state === 'recording') return; 

    const rec = new SpeechRecognition();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onstart = () => setRecording(true);
    rec.onresult = (event: any) => sendText(event.results[0][0].transcript);
    rec.onerror = (e: any) => { 
        if (e.error === 'no-speech' && autoModeRef.current) { 
            setAutoMode(false); 
            autoModeRef.current = false; 
            message.warning("Đã tắt Mic do không có tiếng nói."); 
        }
        setRecording(false); 
    };
    rec.onend = () => setRecording(false);
    rec.start();
  };

  const handleAudio = async (blob: Blob) => {
    try {
        setTranscribing(true);
        const form = new FormData(); 
        form.append('file', blob, 'record.wav'); 
        const res: any = await axiosClient.post('/speech/transcribe', form);
        
        const transcript = typeof res === 'string' ? res : res.data;
        
        const assessForm = new FormData(); 
        assessForm.append('file', blob, 'record.wav'); 
        assessForm.append('text', targetSentence || transcript);
        const assessRes: any = await axiosClient.post('/speech/assess', assessForm);
        
        setLastAssessment(assessRes);
        if (!targetSentence) await sendText(transcript);
        else {
            setMessages(prev => [...prev, { id: uuidv4(), from: 'user', text: transcript }]);
            saveMessageToDB(transcript, 'user');
        }
    } catch (e) { 
        message.error('Lỗi xử lý âm thanh.'); 
    } finally { 
        setTranscribing(false); 
    }
  };

  const toggleRecord = async () => {
    if (recording) { 
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop(); 
        return; 
    }
    try {
        if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null; }
        setLastAssessment(null);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const mr = new ExtendableMediaRecorder(stream, { mimeType: 'audio/wav' });
        chunksRef.current = [];
        mr.ondataavailable = (e: any) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = async () => { 
            setRecording(false); 
            if (chunksRef.current.length > 0) { 
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' }); 
                await handleAudio(blob); 
            }
        };
        mr.start(); mediaRecorderRef.current = mr; setRecording(true);
    } catch(e) { message.error("Không thể mở Mic"); }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div className="glass-panel" style={{
            width: '100%', maxWidth: '1000px', height: '90vh',
            borderRadius: '24px', display: 'flex', overflow: 'hidden', position: 'relative'
        }}>
            {/* SIDEBAR */}
            <div style={{ width: '280px', borderRight: GLASS_BORDER, padding: '24px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.4)' }} className="hidden md:flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
                    <div style={{ background: PRIMARY_GRADIENT, padding: 8, borderRadius: 10 }}>
                        <Sparkles size={20} color="white" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>AESP AI</h2>
                        <span style={{ fontSize: 12, color: '#64748b' }}>Premium Practice</span>
                    </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Chủ đề (Topic)</label>
                    <Select
                        className="w-full"
                        suffixIcon={<ChevronDown size={14} color="#4F46E5" />}
                        value={selectedTopic?.topicId}
                        placeholder="Chọn chủ đề"
                        onChange={(value) => {
                            const found = topics.find(t => t.topicId === value);
                            setSelectedTopic(found || null);
                        }}
                        options={topics.map(t => ({ value: t.topicId, label: t.topicName }))}
                    />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8, display: 'block', textTransform: 'uppercase' }}>Cấp độ (Level)</label>
                    <Select
                        className="w-full"
                        suffixIcon={<ChevronDown size={14} color="#4F46E5" />}
                        value={selectedLevel}
                        onChange={setSelectedLevel}
                        options={[
                           { value: 'BEGINNER', label: 'Cơ bản (Beginner)' },
                           { value: 'INTERMEDIATE', label: 'Trung cấp (Intermediate)' }
                        ]}
                    />
                </div>

                <div style={{ flex: 1 }}>
                     {lastAssessment && (
                        <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <BarChart3 size={16} className="text-indigo-600"/>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>Phát âm gần nhất</span>
                            </div>
                            <div style={{ textAlign: 'center', marginBottom: 10 }}>
                                <Progress type="circle" percent={lastAssessment.overallScore} size={80} strokeColor={{ '0%': '#4F46E5', '100%': '#EC4899' }} />
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                                {lastAssessment.words?.map((w: any, i: number) => (
                                    <span key={i} style={{
                                        fontSize: 12, padding: '2px 6px', borderRadius: 4,
                                        background: w.accuracyScore >= 80 ? '#dcfce7' : '#fee2e2',
                                        color: w.accuracyScore >= 80 ? '#166534' : '#991b1b',
                                    }}>{w.word}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'white', borderRadius: 12 }}>
                    <Avatar icon={<User />} style={{ backgroundColor: '#EC4899' }} />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Người dùng</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Free Plan</div>
                    </div>
                </div>
            </div>

            {/* MAIN CHAT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.6)' }}>
                <div style={{ 
                    height: 70, borderBottom: GLASS_BORDER, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
                    background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(5px)'
                }}>
                    <div className="hidden md:block">
                        <h3 style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
                            {selectedTopic ? selectedTopic.topicName : 'Tự do'}
                        </h3>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                            {selectedTopic ? selectedTopic.description : 'Chọn chủ đề để luyện tập'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        {selectedTopic && messages.length > 0 && (
                            <Popconfirm
                                title="Xóa lịch sử?"
                                description="Hành động này không thể hoàn tác."
                                onConfirm={handleClearHistory}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                            >
                                <Button danger type="text" shape="circle" icon={<Trash2 size={18} />} />
                            </Popconfirm>
                        )}

                        <Button 
                            shape="round" 
                            size="middle"
                            onClick={() => {
                                if(autoMode) { setAutoMode(false); autoModeRef.current = false; window.speechSynthesis.cancel(); } 
                                else { setAutoMode(true); autoModeRef.current = true; setTargetSentence(''); startLiveRecognition(); }
                            }}
                            style={{ 
                                background: autoMode ? '#10b981' : 'white', 
                                borderColor: autoMode ? '#10b981' : '#e2e8f0',
                                color: autoMode ? 'white' : '#64748b',
                                fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            {autoMode ? <Loader2 className="animate-spin" size={16}/> : <Bot size={16}/>}
                            {autoMode ? 'Auto Mode: ON' : 'Chế độ rảnh tay'}
                        </Button>
                    </div>
                </div>

                {/* CHAT AREA */}
                <div ref={scrollRef} className="chat-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '24px', position: 'relative' }}>
                    {targetSentence && (
                        <div style={{ 
                            background: 'linear-gradient(to right, #e0e7ff, #f3e8ff)', 
                            borderRadius: 16, padding: 20, marginBottom: 24, 
                            border: '1px solid rgba(79, 70, 229, 0.2)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                            position: 'sticky', top: 0, zIndex: 10
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5 }}>Bài tập phát âm</span>
                                <Button type="text" shape="circle" icon={<Volume2 size={18} color="#4F46E5"/>} onClick={() => speak(targetSentence)} />
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', lineHeight: 1.5, margin: 0 }}>"{targetSentence}"</h3>
                        </div>
                    )}

                    {messages.length === 0 && !targetSentence && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
                            <MessageSquare size={32} color="#94a3b8" />
                            <p style={{ color: '#64748b', marginTop: 10 }}>Bắt đầu cuộc trò chuyện.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'end', gap: 8, flexDirection: msg.from === 'user' ? 'row-reverse' : 'row' }}>
                                {msg.from !== 'user' && (
                                    <Avatar size={32} icon={msg.from === 'ai' ? <Bot size={18}/> : <Sparkles size={18}/>} style={{ background: msg.from === 'system' ? '#94a3b8' : 'white', border: '1px solid #e2e8f0', color: '#4F46E5' }} />
                                )}
                                <div className={msg.from === 'user' ? 'bubble-user' : 'bubble-ai'} style={{ padding: '12px 18px', maxWidth: '75%', fontSize: 15, lineHeight: 1.6 }}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER INPUT */}
                <div style={{ padding: '20px 24px', background: 'white', borderTop: GLASS_BORDER }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Tooltip title="Lấy câu mẫu mới">
                            <Button shape="circle" size="large" icon={<Lightbulb size={20} />} onClick={getSampleSentence} disabled={recording || autoMode} style={{ border: 'none', background: '#F1F5F9', color: '#64748b' }} />
                        </Tooltip>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <Input 
                                placeholder={recording ? "Đang lắng nghe..." : "Nhập tin nhắn..."}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onPressEnter={() => sendText(input)}
                                disabled={recording}
                                style={{ borderRadius: 24, padding: '10px 45px 10px 20px', fontSize: 15, border: '1px solid #E2E8F0', background: '#F8FAFC' }}
                            />
                            <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                                <Button type="text" shape="circle" size="small" icon={<Send size={18} />} onClick={() => sendText(input)} style={{ color: input.trim() ? '#4F46E5' : '#cbd5e1' }} />
                            </div>
                        </div>

                        <Button 
                            shape="circle" size="large"
                            className={recording && !autoMode ? 'recording-active' : ''}
                            icon={transcribing ? <Loader2 className="animate-spin" /> : (recording ? <Square fill="currentColor" size={16}/> : <Mic size={22}/>)}
                            onClick={toggleRecord}
                            disabled={autoMode}
                            style={{ width: 50, height: 50, flexShrink: 0, border: 'none', background: recording ? '#EC4899' : PRIMARY_GRADIENT, color: 'white', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}