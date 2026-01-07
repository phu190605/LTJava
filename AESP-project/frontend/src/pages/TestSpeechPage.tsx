import React, { useState, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import RecordRTC from 'recordrtc';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Input, 
  Typography, 
  Statistic, 
  Progress, 
  Divider, 
  Spin, 
  Space
} from 'antd';
import { 
  AudioOutlined, 
  StopOutlined, 
  CheckCircleOutlined, 
  HighlightOutlined, 
  SoundOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- Interfaces giữ nguyên ---
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
  // --- State Logic giữ nguyên ---
  const [referenceText, setReferenceText] = useState<string>(
    "Hello world. I am learning to speak English properly."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);

  // --- Logic Ghi âm & API (Không đổi) ---
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
      console.error("Lỗi micro:", err);
      alert("Không thể truy cập Micro! Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
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

      const response = await axios.post<AssessmentResult>(
        "http://localhost:8080/api/speech/assess", 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResult(response.data);
    } catch (error: any) {
      console.error("Lỗi:", error);
      alert("Lỗi chấm điểm: " + (error.response?.data?.message || "Lỗi kết nối Backend!"));
    } finally {
      setLoading(false);
    }
  };

  // --- Render Giao diện Mới ---
  return (
    <MainLayout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ margin: 0 }}>
            <HighlightOutlined /> Kiểm tra phát âm (AESP)
          </Title>
          <Text type="secondary">Luyện tập phát âm chuẩn với công nghệ AI</Text>
        </div>

        {/* Khu vực Nhập liệu & Điều khiển */}
        <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Title level={5}>Đoạn văn mẫu:</Title>
          <TextArea 
            rows={3}
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            style={{ fontSize: '16px', marginBottom: 20 }}
            placeholder="Nhập đoạn văn bạn muốn luyện tập..."
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center', flexDirection: 'column' }}>
            <Space size="large">
              {!isRecording ? (
                <Button 
                  type="primary" 
                  danger 
                  shape="round" 
                  icon={<AudioOutlined />} 
                  size="large"
                  onClick={startRecording}
                  disabled={loading}
                >
                  Bắt đầu Ghi âm
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  shape="round" 
                  icon={<StopOutlined />} 
                  size="large"
                  onClick={stopRecording}
                  className="animate-pulse" // Bạn có thể thêm css animation cho nút này đập nhẹ
                  style={{ backgroundColor: '#1890ff' }}
                >
                  Dừng & Chấm điểm
                </Button>
              )}
            </Space>

            {/* Audio Player hiển thị khi có file */}
            {audioUrl && !isRecording && !loading && (
              <div style={{ marginTop: 10 }}>
                <audio src={audioUrl} controls style={{ borderRadius: '20px', height: '40px' }} />
              </div>
            )}
          </div>
        </Card>

        {/* Khu vực Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" tip="AI đang phân tích giọng nói của bạn..." />
          </div>
        )}

        {/* Khu vực Kết quả */}
        {result && !loading && (
          <div style={{ marginTop: 30 }}>
            <Divider>Kết quả phân tích</Divider>
            
            {/* Tổng quan điểm số */}
            <Row gutter={[16, 16]}>
              {/* Cột Điểm tổng & Level */}
              <Col xs={24} md={8}>
                <Card bordered={false} style={{ height: '100%', textAlign: 'center', background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Space direction="vertical" size="small">
                    <Text strong style={{ fontSize: 16 }}>Đánh giá tổng quát</Text>
                    <Progress 
                      type="circle" 
                      percent={Math.round(result.overallScore)} 
                      strokeColor={result.overallScore >= 80 ? '#52c41a' : result.overallScore >= 50 ? '#faad14' : '#ff4d4f'}
                      format={(percent) => <span style={{ color: '#333' }}>{percent}</span>}
                    />
                    <Title level={4} style={{ margin: '10px 0 0' }}>{result.level}</Title>
                    <Text type="secondary" italic>"{result.feedback}"</Text>
                  </Space>
                </Card>
              </Col>

              {/* Cột Chi tiết các chỉ số */}
              <Col xs={24} md={16}>
                <Card bordered={false} style={{ height: '100%' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Statistic
                        title="Độ chính xác (Accuracy)"
                        value={result.accuracyScore}
                        precision={1}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<CheckCircleOutlined />}
                        suffix="/ 100"
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Độ trôi chảy (Fluency)"
                        value={result.fluencyScore}
                        precision={1}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<SoundOutlined />}
                        suffix="/ 100"
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Độ hoàn thiện (Completeness)"
                        value={result.completenessScore}
                        precision={1}
                        valueStyle={{ color: '#cf1322' }}
                        suffix="/ 100"
                      />
                    </Col>
                  </Row>
                  
                  <Divider style={{ margin: '20px 0' }} />
                  
                  {/* Phân tích từng từ */}
                  <Title level={5}>Chi tiết phát âm:</Title>
                  <div style={{ 
                    padding: '20px', 
                    background: '#fafafa', 
                    borderRadius: '8px', 
                    fontSize: '1.2rem', 
                    lineHeight: '2rem',
                    border: '1px solid #f0f0f0'
                  }}>
                    {result.words.map((w, i) => {
                      const isError = w.errorType !== "None";
                      return (
                        <span key={i} style={{ marginRight: 8, display: 'inline-block' }}>
                          <span 
                            style={{ 
                              color: isError ? '#cf1322' : '#389e0d',
                              fontWeight: isError ? 'bold' : 500,
                              textDecoration: isError ? 'underline' : 'none',
                              cursor: 'default'
                            }}
                            title={isError ? `Lỗi: ${w.errorType} (${Math.round(w.accuracyScore)}%)` : `Tốt (${Math.round(w.accuracyScore)}%)`}
                          >
                            {w.word}
                          </span>
                          {/* Hiển thị điểm nhỏ bên dưới nếu là lỗi */}
                          {isError && (
                            <div style={{ fontSize: '0.7rem', color: '#999', textAlign: 'center', marginTop: '-5px' }}>
                              {Math.round(w.accuracyScore)}%
                            </div>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TestSpeechPage;