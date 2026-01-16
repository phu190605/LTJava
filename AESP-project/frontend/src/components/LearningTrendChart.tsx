import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface Props {
    pronunciation: number[];
    fluency: number[];
    labels: string[];
}

const LearningTrendChart: React.FC<Props> = ({ pronunciation, fluency, labels }) => {
    // Chuyển đổi dữ liệu từ các mảng riêng biệt sang mảng Object cho Recharts
    const chartData = labels.map((label, index) => ({
        name: label,
        pronunciation: pronunciation[index],
        fluency: fluency[index],
    }));

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="pronunciation" 
                        stroke="#1890ff" 
                        name="Phát âm" 
                        strokeWidth={2} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="fluency" 
                        stroke="#52c41a" 
                        name="Trôi chảy" 
                        strokeWidth={2} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LearningTrendChart; // BẮT BUỘC PHẢI CÓ DÒNG NÀY