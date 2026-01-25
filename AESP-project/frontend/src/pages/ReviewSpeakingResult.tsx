import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useParams } from "react-router-dom";

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

const ReviewSpeakingResult = () => {
    const { userId } = useParams<{ userId: string }>();
    const [results, setResults] = useState<PartResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        axiosClient.get(`/speaking/results?userId=${userId}`)
            .then(res => {
                if (Array.isArray(res)) {
                    setResults(res.map((item: any) => ({
                        previewUrl: item.audioUrl,
                        aiResult: item.aiResult,
                        partNumber: item.partNumber,
                        referenceText: item.referenceText
                    })));
                } else {
                    setResults([]);
                }
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (!userId) return <div>Thiếu userId trên URL.</div>;
    if (loading) return <div>Đang tải kết quả...</div>;
    if (results.length === 0) return <div>Chưa có kết quả speaking test cho user này.</div>;

    return (
        <div className="container">
            <h2>Kết quả Speaking Test của học viên</h2>
            {results.map((part, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, margin: '24px 0', padding: 16 }}>
                    <h3>Phần {part.partNumber}</h3>
                    {part.referenceText && (
                        <div style={{ marginBottom: 8, color: '#333' }}><b>Câu hỏi:</b> {part.referenceText}</div>
                    )}
                    <audio src={part.previewUrl} controls style={{ width: 320 }} />
                    {part.aiResult && (
                        <div style={{ marginTop: 12 }}>
                            <div><b>Level:</b> {part.aiResult.level}</div>
                            <div><b>Điểm tổng:</b> {Math.round(part.aiResult.overallScore)}/100</div>
                            <div><b>Feedback:</b> {part.aiResult.feedback}</div>
                            <div style={{ display: 'flex', gap: 16, margin: '8px 0' }}>
                                <div>Accuracy: <b>{Math.round(part.aiResult.accuracyScore)}</b></div>
                                <div>Fluency: <b>{Math.round(part.aiResult.fluencyScore)}</b></div>
                                <div>Completeness: <b>{Math.round(part.aiResult.completenessScore)}</b></div>
                            </div>
                            <div style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                                {part.aiResult.words.map((w, i) => (
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
            ))}
        </div>
    );
};

export default ReviewSpeakingResult;
