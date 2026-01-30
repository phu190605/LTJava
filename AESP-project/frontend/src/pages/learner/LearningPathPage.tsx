import { useEffect, useState, useRef } from "react";
import { Card, Tag, Spin, Empty, message, Row, Col, Button, Progress } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { 
  getLearningPathById, 
  getUserLearningPath,
  getPathContent,
  getSpeechAssessmentDetail,
  saveSpeechAssessment
} from "../../api/learningPathApi";
import type { LearningPathResponse, UserLearningPathResponse, PathContentResponse } from "../../api/learningPathApi";
import axiosClient from "../../api/axiosClient";
import { getCurrentUser } from "../../utils/auth";

const GOALS = [
  { code: "CAREER", label: "Sự nghiệp" },
  { code: "EDUCATION", label: "Giáo dục" },
  { code: "TRAVEL", label: "Du lịch" },
  { code: "SOCIAL", label: "Xã hội" },
];
const TOPICS = [
  { code: "COOKING", label: "Nấu ăn" },
  { code: "SPORTS", label: "Thể thao" },
  { code: "MUSIC", label: "Âm nhạc" },
  { code: "TECH", label: "Công nghệ" },
];

export default function LearningPathPage() {
  const [enrolledPath, setEnrolledPath] = useState<UserLearningPathResponse | null>(null);
  const [pathDetails, setPathDetails] = useState<LearningPathResponse | null>(null);
  const [pathContent, setPathContent] = useState<PathContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<LearningPathResponse | null>(null);
  
  // Speaking test states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [scores, setScores] = useState<{[key: number]: number}>({});
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  
  // Audio recording states
  const recorderRef = useRef<any>(null);
  const [recordedAudios, setRecordedAudios] = useState<{[key: number]: {blob: Blob, url: string}}>({});
  const [aiResults, setAiResults] = useState<{[key: number]: any}>({});
  const [isProcessing, setIsProcessing] = useState(false);


  // Load dữ liệu enrollment từ backend
  useEffect(() => {
    fetchEnrolledPath();
  }, []);

  // Khi có enrolled path, lấy chi tiết của nó
  useEffect(() => {
    if (enrolledPath?.pathId) {
      fetchPathDetails(enrolledPath.pathId);
      fetchPathContent(enrolledPath.pathId);
    }
  }, [enrolledPath]);

  const fetchEnrolledPath = async () => {
    try {
      setLoading(true);
      const data = await getUserLearningPath();
      
      if (data) {
        console.log("✅ Loaded user's enrolled learning path:", data);
        setEnrolledPath(data);
      } else {
        console.log("📭 User has no enrolled learning path");
        setEnrolledPath(null);
      }
    } catch (error: any) {
      console.error("❌ Error loading enrolled path:", error);
      message.error("Lỗi tải lộ trình học");
      setEnrolledPath(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPathDetails = async (pathId: number) => {
    try {
      console.log("📖 Fetching path details for pathId:", pathId);
      const details = await getLearningPathById(pathId);
      setPathDetails(details);
    } catch (error: any) {
      console.error("❌ Error loading path details:", error);
    }
  };

  const fetchPathContent = async (pathId: number) => {
    try {
      setContentLoading(true);
      console.log("📚 Fetching path content for pathId:", pathId);
      const content = await getPathContent(pathId);
      console.log("✅ Loaded path content:", content);
      setPathContent(content);
    } catch (error: any) {
      console.error("❌ Error loading path content:", error);
    } finally {
      setContentLoading(false);
    }
  };


  // Audio recording functions (reuse SpeakingTest logic)
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
    } catch (error_) {
      message.error("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt.");
    }
  };

  const stopRecording = async () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(async () => {
        const blob = recorderRef.current.getBlob();
        const previewUrl = URL.createObjectURL(blob);
        const audioFile = new File([blob], `question_${currentQuestionIndex}.wav`, { type: "audio/wav" });
        
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          // Send to backend AI assessment
          const currentUser = getCurrentUser();
          const userId = currentUser?.id;
          if (!userId) {
            message.error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
            setIsProcessing(false);
            return;
          }

          const form = new FormData();
          form.append("file", audioFile, `question_${currentQuestionIndex}.wav`);
          form.append("text", pathContent?.questions[currentQuestionIndex].question || "");
          form.append("userId", String(userId));
          form.append("partNumber", String(currentQuestionIndex + 1));
          
          const res = await axiosClient.post("/speech/assess", form);
          const aiResult: any = res && typeof res === 'object' ? res : {};
          
          // Store recorded audio and AI result
          setRecordedAudios(prev => ({
            ...prev,
            [currentQuestionIndex]: { blob, url: previewUrl }
          }));
          setAiResults(prev => ({
            ...prev,
            [currentQuestionIndex]: aiResult
          }));
          
          // Save the speech assessment ID if available
          // (Removed word detail fetch)
          
            // Auto-show results
            setShowResults(true);
          
          // Use AI score if available, otherwise use manual scoring
          const aiScore = aiResult?.overallScore || 0;
          setScores(prev => ({
            ...prev,
            [currentQuestionIndex]: aiScore
          }));
          
          // Set user's answer from audio transcription if available
          if (aiResult?.transcription) {
            setUserAnswers(prev => ({
              ...prev,
              [currentQuestionIndex]: aiResult.transcription
            }));
          }
          
          message.success("Đã ghi âm và chấm điểm! AI Score: " + Math.round(aiScore));
          
          // 💾 AUTO-SAVE TO vocab_question_attempts
          if (enrolledPath && pathContent?.questions[currentQuestionIndex]) {
            try {
              const currentQuestion = pathContent.questions[currentQuestionIndex];
              console.log("💾 Saving speech assessment to vocab_question_attempts...");
              await saveSpeechAssessment(
                enrolledPath.enrollmentId,
                currentQuestion.id,
                aiScore,
                aiResult?.transcription || "",
                aiResult?.audioUrl || ""
              );
              console.log("✅ Saved to vocab_question_attempts successfully");
            } catch (error_) {
              console.error("⚠️ Warning: Could not save to vocab_question_attempts:", error_);
              // Don't show error message to user - this is a non-critical background save
            }
          }
        } catch (err) {
          console.error("Error assessing audio:", err);
          message.error("Lỗi khi chấm điểm. Vui lòng thử lại.");
        } finally {
          setIsProcessing(false);
        }
      });
    }
  };

  if (loading) {
    return <Spin fullscreen tip="Đang tải lộ trình học của bạn..." />;
  }

  if (selectedPath) {
    return (
      <PathDetail 
        path={selectedPath} 
        onBack={() => setSelectedPath(null)}
        enrolledData={enrolledPath}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 24 }}>🎓 Chi tiết lộ trình học tập</h2>

      {/* ===== NO ENROLLMENT ===== */}
      {!enrolledPath ? (
        <Empty
          description="Bạn chưa đăng ký lộ trình học"
          style={{ marginTop: 50 }}
        >
          <Button type="primary" onClick={() => globalThis.location.href = '/checkout'}>
            📚 Chọn lộ trình học ngay
          </Button>
        </Empty>
      ) : (
        <>
          {/* ===== ENROLLMENT BANNER ===== */}
          <Card 
            style={{ 
              marginBottom: 24,
              background: "#ffffff",
              borderColor: "#e8e8e8",
              borderWidth: 2,
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.1)"
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={16}>
                <div style={{ padding: "8px 0" }}>
                  <h3 style={{ color: "#667eea", marginBottom: 12, fontSize: 18, fontWeight: "bold" }}>📌 Lộ trình của bạn</h3>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    <Tag style={{ background: "#667eea", color: "white", border: "none", padding: "4px 12px", fontSize: 13, fontWeight: 500 }}>
                      {enrolledPath.level}
                    </Tag>
                    <Tag style={{ background: "#52c41a", color: "white", border: "none", padding: "4px 12px", fontSize: 13, fontWeight: 500 }}>
                      {enrolledPath.goalCode}
                    </Tag>
                    <Tag style={{ background: "#fa8c16", color: "white", border: "none", padding: "4px 12px", fontSize: 13, fontWeight: 500 }}>
                      {enrolledPath.topicCode}
                    </Tag>
                  </div>
                  <div style={{ color: "#333333" }}>
                    <p style={{ margin: "8px 0", fontSize: 15 }}>
                      <strong style={{ color: "#667eea" }}>Trạng thái:</strong> <span style={{ color: "#666" }}>{enrolledPath.status}</span>
                    </p>
                    <p style={{ margin: "8px 0", fontSize: 15 }}>
                      <strong style={{ color: "#667eea" }}>Tiến độ:</strong> <span style={{ color: "#666" }}>{enrolledPath.progress || 0}%</span>
                    </p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", height: "100%", padding: "16px", background: "#f0f5ff", borderRadius: "8px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: "bold", marginBottom: 4, color: "#667eea" }}>
                      {enrolledPath.progress || 0}%
                    </div>
                    <div style={{ fontSize: 13, color: "#666" }}>Hoàn thành</div>
                  </div>
                  <Progress percent={enrolledPath.progress || 0} strokeColor="#667eea" />
                </div>
              </Col>
            </Row>
          </Card>

          {/* ===== SPEAKING TEST SECTION ===== */}
          {pathDetails ? (
            <>
              <Card style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>🎤 Bài kiểm tra nói tiếng Anh</h3>
                {contentLoading ? (
                  <Spin tip="Đang tải nội dung...">
                    <div style={{ minHeight: 80 }} />
                  </Spin>
                ) : pathContent && pathContent.questions.length > 0 ? (
                  <>
                    {!showFinalResults ? (
                      <>
                    {/* Progress bar */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span><strong>Câu {currentQuestionIndex + 1} / {pathContent.questions.length}</strong></span>
                        <span style={{ color: "#1890ff" }}><strong>Điểm: {Object.values(scores).reduce((a, b) => a + b, 0)} / {pathContent.questions.length * 100}</strong></span>
                      </div>
                      <Progress percent={((currentQuestionIndex + 1) / pathContent.questions.length) * 100} />
                    </div>

                    {/* Question card */}
                    {!showResults ? (
                      <div style={{ 
                        background: "#f0f5ff", 
                        padding: "30px", 
                        borderRadius: 8, 
                        marginBottom: 24,
                        textAlign: "center"
                      }}>
                        <div style={{ marginBottom: 24 }}>
                          <h2 style={{ fontSize: 28, marginBottom: 16, color: "#1890ff" }}>
                            {pathContent.questions[currentQuestionIndex].question}
                          </h2>
                          <p style={{ color: "#666", fontSize: 14 }}>
                            Trả lời câu hỏi này bằng cách nói tiếng Anh
                          </p>
                        </div>


                        {/* Recording button - reuse SpeakingTest logic */}
                        <Button
                          type="primary"
                          size="large"
                          icon={<AudioOutlined />}
                          onClick={isRecording ? stopRecording : startRecording}
                          loading={isProcessing}
                          style={{ marginBottom: 16 }}
                          danger={isRecording}
                        >
                          {isRecording ? "⏹ Dừng & Chấm điểm" : "🎤 Bắt đầu ghi âm"}
                        </Button>
                        
                        {/* Audio player for recorded audio */}
                        {recordedAudios[currentQuestionIndex] && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>📻 Âm thanh đã ghi:</p>
                            <audio 
                              src={recordedAudios[currentQuestionIndex].url} 
                              controls 
                              style={{ width: "100%", marginBottom: 8 }}
                            >
                              <track kind="captions" />
                            </audio>
                          </div>
                        )}
                        
                        {/* AI Assessment Result */}
                        {aiResults[currentQuestionIndex] && (
                          <div style={{ background: "#f0f7ff", padding: "12px", borderRadius: 4, marginBottom: 16 }}>
                            <p style={{ margin: "4px 0", fontSize: 14 }}>
                              <strong>🤖 Phân tích AI:</strong>
                            </p>
                            {aiResults[currentQuestionIndex].accuracyScore && (
                              <p style={{ margin: "4px 0", fontSize: 13 }}>
                                📊 Độ chính xác: <strong>{aiResults[currentQuestionIndex].accuracyScore}%</strong>
                              </p>
                            )}
                            {aiResults[currentQuestionIndex].fluencyScore && (
                              <p style={{ margin: "4px 0", fontSize: 13 }}>
                                🎯 Tính trôi chảy: <strong>{aiResults[currentQuestionIndex].fluencyScore}%</strong>
                              </p>
                            )}
                            {aiResults[currentQuestionIndex].feedback && (
                              <p style={{ margin: "8px 0", fontSize: 13, color: "#555" }}>
                                💡 {aiResults[currentQuestionIndex].feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Results view */
                      <div style={{ 
                        background: "#f6f8fb", 
                        padding: "24px", 
                        borderRadius: 8, 
                        marginBottom: 24
                      }}>
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                          <div style={{ fontSize: 48, marginBottom: 8 }}>
                            {scores[currentQuestionIndex] >= 70 ? "✅" : "⚠️"}
                          </div>
                          <h3 style={{ fontSize: 20 }}>
                            Điểm: <strong style={{ color: scores[currentQuestionIndex] >= 70 ? "#52c41a" : "#ff4d4f" }}>
                              {scores[currentQuestionIndex]}/100
                            </strong>
                          </h3>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                          <p style={{ marginBottom: 8 }}>
                            <strong>Câu hỏi:</strong> {pathContent.questions[currentQuestionIndex].question}
                          </p>
                          {userAnswers[currentQuestionIndex] && (
                            <p style={{ marginBottom: 8 }}>
                              <strong>Phiên âm của bạn:</strong> {userAnswers[currentQuestionIndex]}
                            </p>
                          )}
                        </div>

                        <div style={{ background: "#fffbe6", padding: "12px", borderRadius: 4, marginBottom: 16 }}>
                          <p style={{ margin: 0, fontSize: 14 }}>
                              💡 <strong>Nhận xét:</strong> {scores[currentQuestionIndex] >= 70 ? "Tuyệt vời! Bạn đã trả lời tốt." : "Hãy thử lại để cải thiện kỹ năng phát âm."}
                          </p>
                        </div>

                        <div style={{ marginTop: 12 }} />


                      </div>
                    )}

                    {/* Navigation buttons */}
                    <Row gutter={12} style={{ marginBottom: 20 }}>
                      <Col xs={24} sm={8}>
                        <Button
                          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                          disabled={currentQuestionIndex === 0}
                          style={{ width: "100%" }}
                        >
                          ← Câu trước
                        </Button>
                      </Col>
                      <Col xs={24} sm={8}>
                        {showResults && (
                          <Button
                            type="default"
                            onClick={() => setShowResults(false)}
                            style={{ width: "100%" }}
                          >
                            🔄 Ghi âm lại
                          </Button>
                        )}
                      </Col>
                      <Col xs={24} sm={8}>
                        <Button
                          onClick={() => {
                            if (currentQuestionIndex === pathContent.questions.length - 1) {
                              setShowFinalResults(true);
                              } else {
                                if (showResults) {
                                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                                  setShowResults(false);
                                } else {
                                  message.warning("Vui lòng ghi âm trước khi chuyển câu");
                                }
                              }
                            }}
                              disabled={!showResults}
                            style={{ width: "100%" }}
                          >
                            {currentQuestionIndex === pathContent.questions.length - 1 ? "🏁 Kết thúc" : "Câu sau →"}
                          </Button>
                      </Col>
                    </Row>
                      </>
                    ) : (
                      /* FINAL RESULTS */
                      <div style={{ 
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                        padding: "40px 32px", 
                        borderRadius: 8, 
                        marginBottom: 24,
                        color: "white",
                        textAlign: "center",
                        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)"
                      }}>
                        <div style={{ marginBottom: 32 }}>
                          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                          <h2 style={{ fontSize: 36, fontWeight: "bold", marginBottom: 8 }}>Hoàn thành bài kiểm tra!</h2>
                          <p style={{ fontSize: 16, opacity: 0.9 }}>Bạn đã hoàn thành tất cả {pathContent.questions.length} câu hỏi</p>
                        </div>

                        <div style={{ 
                          background: "rgba(255, 255, 255, 0.15)", 
                          padding: "24px", 
                          borderRadius: 12, 
                          marginBottom: 24,
                          backdropFilter: "blur(10px)"
                        }}>
                          <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>Tổng điểm</p>
                            <div style={{ fontSize: 48, fontWeight: "bold", marginBottom: 8 }}>
                              {Object.values(scores).reduce((a, b) => a + b, 0)} / {pathContent.questions.length * 100}
                            </div>
                            <p style={{ fontSize: 16, opacity: 0.9 }}>
                              Trung bình: {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(scores).length, 1))} / 100
                            </p>
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>Hoàn thành</p>
                            <Progress 
                              percent={100} 
                              strokeColor="#52c41a" 
                              format={() => "100%"}
                              style={{ marginBottom: 0 }}
                            />
                          </div>
                        </div>

                        <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
                          <Col xs={24} sm={8}>
                            <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: "16px", borderRadius: 8 }}>
                              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Câu hoàn thành</p>
                              <p style={{ fontSize: 28, fontWeight: "bold" }}>{Object.keys(scores).length} / {pathContent.questions.length}</p>
                            </div>
                          </Col>
                          <Col xs={24} sm={8}>
                            <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: "16px", borderRadius: 8 }}>
                              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Số câu hỏi</p>
                              <p style={{ fontSize: 28, fontWeight: "bold" }}>{pathContent.questions.length}</p>
                            </div>
                          </Col>
                          <Col xs={24} sm={8}>
                            <div style={{ background: "rgba(255, 255, 255, 0.1)", padding: "16px", borderRadius: 8 }}>
                              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Tỉ lệ hoàn thành</p>
                              <p style={{ fontSize: 28, fontWeight: "bold" }}>100%</p>
                            </div>
                          </Col>
                        </Row>

                        <Button 
                          type="primary" 
                          size="large"
                          onClick={() => globalThis.location.href = '/dashboard'}
                          style={{ fontSize: 16, padding: "12px 32px", height: "auto" }}
                        >
                          🏠 Quay lại Dashboard
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Empty description="Chưa có nội dung cho lộ trình này" />
                )}
              </Card>
            </>
          ) : (
            <Card>
              <Spin tip="Đang tải chi tiết lộ trình...">
                <div style={{ minHeight: 80 }} />
              </Spin>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

interface PathDetailProps {
  readonly path: LearningPathResponse | UserLearningPathResponse;
  readonly onBack: () => void;
  readonly enrolledData?: UserLearningPathResponse | null;
}

function PathDetail({ path, onBack, enrolledData }: PathDetailProps) {
  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <Button 
        type="link" 
        onClick={onBack}
        style={{ marginBottom: 24, color: "#667eea", fontSize: 15, fontWeight: 500 }}
      >
        ← Quay lại
      </Button>

      {/* ===== FILTER INFO BANNER ===== */}
      {enrolledData && (
        <Card 
          style={{ 
            marginBottom: 24, 
            background: "#f6f8fb", 
            borderColor: "#e0e8f5",
            borderWidth: 1,
            borderLeft: "6px solid #667eea"
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "#333", fontWeight: "600", fontSize: 14 }}>🎯 Lộ trình của bạn:</span>
            <Tag style={{ background: "#667eea", color: "white", border: "none", fontSize: 13, padding: "4px 12px", fontWeight: 500 }}>
              {enrolledData.level}
            </Tag>
            <Tag style={{ background: "#52c41a", color: "white", border: "none", fontSize: 13, padding: "4px 12px", fontWeight: 500 }}>
              {GOALS.find((g) => g.code === enrolledData.goalCode)?.label}
            </Tag>
            <Tag style={{ background: "#fa8c16", color: "white", border: "none", fontSize: 13, padding: "4px 12px", fontWeight: 500 }}>
              {TOPICS.find((t) => t.code === enrolledData.topicCode)?.label}
            </Tag>
          </div>
        </Card>
      )}

      {/* ===== HEADER ===== */}
      <div style={{ 
        marginBottom: 32,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 12,
        padding: "40px 32px",
        color: "white",
        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.25)"
      }}>
        <h1 style={{ margin: "0 0 20px 0", fontSize: 36, fontWeight: "bold" }}>🎯 {path.pathId}</h1>
        <p style={{ margin: "0 0 24px 0", fontSize: 16, lineHeight: 1.6, opacity: 0.95 }}>
          {path.description}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 6, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Cấp độ</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>{path.level}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 6, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Mục tiêu</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>{GOALS.find((g) => g.code === path.goalCode)?.label}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 6, backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>Chủ đề</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>{TOPICS.find((t) => t.code === path.topicCode)?.label}</div>
          </div>
        </div>
      </div>

      {/* ===== STATS SECTION ===== */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: "center", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>Ngày tạo</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              {new Date(path.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: "center", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>Ngày cập nhật</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
              {new Date(path.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: "center", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>Path ID</div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: "#667eea", fontFamily: "monospace" }}>
              {path.pathId}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: "center", height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>Trạng thái</div>
            <Tag style={{ background: "#667eea", color: "white", border: "none", fontSize: 14, padding: "4px 12px", fontWeight: 500 }}>
              Hoạt động
            </Tag>
          </Card>
        </Col>
      </Row>

      {/* ===== ACTION BUTTONS ===== */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Button 
          type="primary" 
          size="large" 
          style={{ fontSize: 16, padding: "24px 48px", height: "auto" }}
        >
          👉 Bắt đầu học ngay
        </Button>
        <Button 
          size="large" 
          onClick={onBack}
          style={{ fontSize: 16, padding: "24px 48px", height: "auto" }}
        >
          ← Quay lại danh sách
        </Button>
      </div>
    </div>
  );
}
