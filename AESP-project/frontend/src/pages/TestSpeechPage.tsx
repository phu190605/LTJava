import React, { useState, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import RecordRTC from 'recordrtc';
import { useNavigate } from 'react-router-dom'; // Thêm điều hướng
import { 
  Card, Row, Col, Button, Input, Typography, 
  Statistic, Progress, Divider, Spin, Space, Tooltip 
} from 'antd';
import { 
  AudioOutlined, StopOutlined, CheckCircleOutlined, 
  HighlightOutlined, SoundOutlined, RocketOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- CSS Constants ---
const PRIMARY_COLOR = '#2B4DFF';
const SUCCESS_COLOR = '#52c41a';
const ERROR_COLOR = '#ff4d4f';
const BG_LIGHT = '#F8FAFC';

const cssStyles = `
  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
  }
  .recording-active {
    animation: pulse 1.5s infinite;
    background-color: ${ERROR_COLOR} !important;
    border: none !important;
  }
  .word-span {
    transition: all 0.2s;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .word-span:hover {
    background: rgba(0,0,0,0.05);
  }
  .back-btn:hover {
    background: #fff !important;
    color: ${PRIMARY_COLOR} !important;
    border-color: ${PRIMARY_COLOR} !important;
  }
`;

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
  const navigate = useNavigate(); // Hook điều hướng
  const [referenceText, setReferenceText] = useState<string>("Hello world. I am learning to speak English properly.");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);

  // --- Logic Ghi âm & API ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      setResult(null);
      setAudioUrl(null);
    } catch (err) {
      alert("Không thể truy cập Micro!");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        setAudioUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        handleAssess(blob);
      });
    }
  };

  const handleAssess = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav"); 
      formData.append("text", referenceText);
      const response = await axios.post<AssessmentResult>("http://localhost:8080/api/speech/assess", formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <style>{cssStyles}</style>
      <div style={{ maxWidth: 1000, margin: '20px auto 40px', padding: '0 20px' }}>
        
        {/* Thanh điều hướng quay lại */}
        <div style={{ marginBottom: 20 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/dashboard')}
            className="back-btn"
            style={{ 
              fontSize: '16px', 
              color: '#64748B', 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 500
            }}
          >
            Quay lại Dashboard
          </Button>
        </div>

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Space direction="vertical" align="center">
            <div style={{ background: '#EEF2FF', padding: '12px 24px', borderRadius: '50px' }}>
              <Text strong style={{ color: PRIMARY_COLOR }}><RocketOutlined /> AI Pronunciation Checker</Text>
            </div>
            <Title level={1} style={{ marginTop: 10, fontWeight: 800, marginBottom: 0 }}>Luyện Phát Âm Cùng AESP</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>Nhận phản hồi tức thì từ trí tuệ nhân tạo</Text>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* Cột trái: Nhập liệu & Ghi âm */}
          <Col xs={24} lg={10}>
            <Card 
              bordered={false} 
              style={{ borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '100%' }}
            >
              <Title level={5}><HighlightOutlined /> Văn bản mẫu</Title>
              <TextArea 
                rows={6}
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                style={{ 
                  fontSize: '16px', borderRadius: 16, backgroundColor: BG_LIGHT, 
                  border: 'none', padding: '15px', marginBottom: 25, resize: 'none'
                }}
              />

              <div style={{ textAlign: 'center' }}>
                {!isRecording ? (
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<AudioOutlined />}
                    onClick={startRecording}
                    disabled={loading}
                    style={{ 
                      height: 60, padding: '0 40px', borderRadius: 30, 
                      fontSize: 18, fontWeight: 600, background: PRIMARY_COLOR,
                      boxShadow: '0 8px 15px rgba(43, 77, 255, 0.2)'
                    }}
                  >
                    Bắt đầu ghi âm
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    danger
                    size="large"
                    icon={<StopOutlined />}
                    onClick={stopRecording}
                    className="recording-active"
                    style={{ height: 60, padding: '0 40px', borderRadius: 30, fontSize: 18, fontWeight: 600 }}
                  >
                    Dừng & Chấm điểm
                  </Button>
                )}

                {audioUrl && !isRecording && (
                  <div style={{ marginTop: 25, background: BG_LIGHT, padding: '12px', borderRadius: 50 }}>
                    <audio src={audioUrl} controls style={{ height: 35, width: '100%' }} />
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Cột phải: Kết quả */}
          <Col xs={24} lg={14}>
            {!result && !loading ? (
              <div style={{ 
                height: '100%', display: 'flex', flexDirection: 'column', 
                justifyContent: 'center', alignItems: 'center', background: BG_LIGHT,
                borderRadius: 24, border: '2px dashed #E2E8F0', padding: 40, minHeight: 400
              }}>
                <div style={{ width: 80, height: 80, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <AudioOutlined style={{ fontSize: 32, color: PRIMARY_COLOR }} />
                </div>
                <Title level={4} style={{ color: '#64748B', marginBottom: 8 }}>Sẵn sàng phân tích</Title>
                <Text type="secondary" style={{ textAlign: 'center' }}>Bấm nút ghi âm và đọc đoạn văn bên trái để AI đánh giá giọng nói của bạn.</Text>
              </div>
            ) : loading ? (
              <Card bordered={false} style={{ borderRadius: 24, textAlign: 'center', padding: '80px 0', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Space direction="vertical" size="large">
                    <Spin size="large" />
                    <Text strong style={{ fontSize: 18, color: PRIMARY_COLOR }}>AI đang chấm điểm...</Text>
                </Space>
              </Card>
            ) : result && (
              <Card bordered={false} style={{ borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Title level={4} style={{ margin: 0 }}>Kết quả đánh giá</Title>
                    <Button type="link" onClick={() => navigate('/dashboard')} icon={<ArrowLeftOutlined />}>Về Dashboard</Button>
                </div>
                
                <Row gutter={[16, 16]} align="middle">
                  <Col span={10} style={{ textAlign: 'center' }}>
                    <Progress 
                      type="dashboard" 
                      percent={Math.round(result.overallScore)} 
                      strokeWidth={10}
                      strokeColor={{ '0%': PRIMARY_COLOR, '100%': SUCCESS_COLOR }}
                      format={p => <div style={{ fontWeight: 800, fontSize: 26, color: '#0F172A' }}>{p}</div>}
                    />
                    <Title level={3} style={{ margin: '10px 0 0', color: SUCCESS_COLOR }}>{result.level}</Title>
                    <Text italic style={{ color: '#64748B' }}>"{result.feedback}"</Text>
                  </Col>
                  <Col span={14}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text strong><CheckCircleOutlined style={{ color: SUCCESS_COLOR }} /> Accuracy (Chính xác)</Text>
                          <Text strong style={{ color: SUCCESS_COLOR }}>{result.accuracyScore}%</Text>
                        </div>
                        <Progress percent={result.accuracyScore} showInfo={false} strokeColor={SUCCESS_COLOR} strokeWidth={8} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text strong><SoundOutlined style={{ color: PRIMARY_COLOR }} /> Fluency (Trôi chảy)</Text>
                          <Text strong style={{ color: PRIMARY_COLOR }}>{result.fluencyScore}%</Text>
                        </div>
                        <Progress percent={result.fluencyScore} showInfo={false} strokeColor={PRIMARY_COLOR} strokeWidth={8} />
                      </div>
                    </Space>
                  </Col>
                </Row>

                <Divider />

                <Title level={5}>Chi tiết từng từ:</Title>
                <div style={{ 
                  padding: '24px', background: BG_LIGHT, borderRadius: 16, 
                  fontSize: '1.4rem', lineHeight: '2.8rem', border: '1px solid #F1F5F9'
                }}>
                  {result.words.map((w, i) => {
                    const isError = w.errorType !== "None";
                    return (
                      <Tooltip key={i} title={isError ? `Lỗi: ${w.errorType}` : `Chính xác: ${Math.round(w.accuracyScore)}%`}>
                        <span className="word-span" style={{ 
                          marginRight: 10, display: 'inline-block',
                          color: isError ? ERROR_COLOR : '#1E293B',
                          fontWeight: isError ? 'bold' : 500,
                          borderBottom: isError ? `3px solid ${ERROR_COLOR}` : `2px solid transparent`,
                          cursor: 'help'
                        }}>
                          {w.word}
                        </span>
                      </Tooltip>
                    );
                  })}
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default TestSpeechPage;