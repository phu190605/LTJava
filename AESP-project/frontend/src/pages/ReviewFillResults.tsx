import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useParams } from "react-router-dom";

interface FillResult {
    partNumber: number;
    userAnswer: string;
    correct: boolean;
    createdAt: string;
}

const ReviewFillResults = () => {
    const { userId } = useParams<{ userId: string }>();
    const [results, setResults] = useState<FillResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        axiosClient.get(`/fill-results?userId=${userId}`)
            .then(res => {
                if (Array.isArray(res)) {
                    setResults(res);
                } else {
                    setResults([]);
                }
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (!userId) return <div>Thiếu userId trên URL.</div>;
    if (loading) return <div>Đang tải kết quả...</div>;
    if (results.length === 0) return <div>Chưa có kết quả điền từ cho user này.</div>;

    return (
        <div className="container">
            <h2>Kết quả Điền từ của học viên</h2>
            {results.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, margin: '16px 0', padding: 12 }}>
                    <b>Phần {item.partNumber}:</b> <br />
                    <span>Đáp án học viên: <b>{item.userAnswer}</b></span><br />
                    <span>Kết quả: {item.correct ? <span style={{ color: 'green' }}>Đúng</span> : <span style={{ color: 'red' }}>Sai</span>}</span><br />
                    <span>Thời gian nộp: {new Date(item.createdAt).toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

export default ReviewFillResults;
