import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { CheckCircleTwoTone, CloseCircleTwoTone, SoundTwoTone } from '@ant-design/icons';

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
    previewUrl: string;
    aiResult?: AssessmentResult;
    partNumber: number;
    referenceText?: string;
}

interface FillResult {
    partNumber: number;
    userAnswer: string;
    correct: boolean;
    createdAt: string;
    questionContent?: string;
}

const ReviewAllResults = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [speakingResults, setSpeakingResults] = useState<PartResult[]>([]);
    const [fillResults, setFillResults] = useState<FillResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        Promise.all([
            axiosClient.get(`/speaking/results?userId=${userId}`),
            axiosClient.get(`/fill-results/with-questions?userId=${userId}`)
        ]).then(([speakRes, fillRes]) => {
            setSpeakingResults(Array.isArray(speakRes) ? speakRes.map((item: any) => ({
                previewUrl: item.audioUrl,
                aiResult: item.aiResult,
                partNumber: item.partNumber,
                referenceText: item.referenceText
            })) : []);
            setFillResults(Array.isArray(fillRes) ? fillRes : []);
        }).finally(() => setLoading(false));
    }, [userId]);

    if (!userId) return <div>Thiếu userId trên URL.</div>;
    if (loading) return <div>Đang tải kết quả...</div>;
    if (speakingResults.length === 0 && fillResults.length === 0) return <div>Chưa có kết quả cho user này.</div>;

    return (
        <div style={{ maxWidth: 700, margin: '32px auto', padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #0001' }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: '#f5f5f5', border: 'none', borderRadius: 6,
                    padding: '6px 16px', fontSize: 16, fontWeight: 500, cursor: 'pointer', marginBottom: 18
                }}
            >
                <ArrowLeftOutlined /> Quay lại
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: 32, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>Kết quả Speaking Test & Điền từ của học viên</h2>
            <h3 style={{ color: '#1976d2', marginBottom: 18, fontWeight: 600 }}>🎤 Phần Speaking</h3>
            {speakingResults.filter(part => part.previewUrl && part.previewUrl.trim() !== "").length === 0 ? <div>Chưa có kết quả speaking.</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {speakingResults.filter(part => part.previewUrl && part.previewUrl.trim() !== "").map((part, idx) => (
                        <div key={"speak-" + idx} style={{ background: '#f6faff', border: '1.5px solid #e3eafc', borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <SoundTwoTone twoToneColor="#1976d2" style={{ fontSize: 22, marginRight: 8 }} />
                                <h4 style={{ margin: 0, fontWeight: 600 }}>Phần {part.partNumber}</h4>
                            </div>
                            {part.referenceText && (
                                <div style={{ marginBottom: 10, color: '#333', fontSize: 16 }}><b>Câu hỏi:</b> {part.referenceText}</div>
                            )}
                            <audio src={part.previewUrl} controls style={{ width: '100%', maxWidth: 350, margin: '8px 0', borderRadius: 8, background: '#fff' }} />
                            {part.aiResult && (
                                <div style={{ marginTop: 14, background: '#eaf6ff', borderRadius: 10, padding: 14 }}>
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ background: '#1976d2', color: '#fff', borderRadius: 6, padding: '2px 12px', fontWeight: 600, fontSize: 15 }}>Level: {part.aiResult.level}</span>
                                        <span style={{ background: '#43a047', color: '#fff', borderRadius: 6, padding: '2px 12px', fontWeight: 600, fontSize: 15 }}>Điểm: {Math.round(part.aiResult.overallScore)}/100</span>
                                    </div>
                                    <div style={{ fontStyle: 'italic', color: '#1976d2', marginBottom: 8 }}>
                                        "{part.aiResult.feedback}"
                                    </div>
                                    <div style={{ display: 'flex', gap: 18, margin: '8px 0', fontSize: 15 }}>
                                        <div>Accuracy: <b>{Math.round(part.aiResult.accuracyScore)}</b></div>
                                        <div>Fluency: <b>{Math.round(part.aiResult.fluencyScore)}</b></div>
                                        <div>Completeness: <b>{Math.round(part.aiResult.completenessScore)}</b></div>
                                    </div>
                                    <div style={{ fontSize: '1.13rem', lineHeight: '1.7', marginTop: 8 }}>
                                        {part.aiResult.words.map((w, i) => (
                                            <span key={i} style={{
                                                color: w.errorType !== "None" ? '#d32f2f' : '#2e7d32',
                                                margin: '0 4px', fontWeight: w.errorType !== "None" ? 'bold' : 'normal',
                                                textDecoration: w.errorType !== "None" ? 'underline' : 'none',
                                                fontSize: 17
                                            }}>
                                                {w.word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <h3 style={{ color: '#1976d2', margin: '36px 0 18px 0', fontWeight: 600 }}>✍️ Phần Điền từ</h3>
            {fillResults.length === 0 ? <div>Chưa có kết quả điền từ.</div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {fillResults.map((item, idx) => (
                        <div key={"fill-" + idx} style={{ background: '#f9fbe7', border: '1.5px solid #e0e7b0', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ background: '#fbc02d', color: '#fff', borderRadius: 6, padding: '2px 12px', fontWeight: 600, fontSize: 15, marginRight: 10 }}>Phần {item.partNumber}</span>
                                {item.correct ? <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20, marginLeft: 4 }} /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 20, marginLeft: 4 }} />}
                            </div>
                            {item.questionContent && (
                                <div style={{ marginBottom: 6, color: '#333', fontSize: 15 }}><b>Câu hỏi:</b> {item.questionContent}</div>
                            )}
                            <div style={{ marginBottom: 4 }}>Đáp án học viên: <b>{item.userAnswer}</b></div>
                            <div style={{ marginBottom: 4 }}>Kết quả: {item.correct ? <span style={{ color: '#43a047', fontWeight: 600 }}>Đúng</span> : <span style={{ color: '#d32f2f', fontWeight: 600 }}>Sai</span>}</div>
                            {item.createdAt && !isNaN(Date.parse(item.createdAt)) && (
                                <div style={{ color: '#888', fontSize: 13 }}>Thời gian nộp: {new Date(item.createdAt).toLocaleString()}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewAllResults;
