import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'antd';

const ActivityHeatMap = ({ rawData }: { rawData: any }) => {
    // Chuyển Map thành Array [{ date: '2026-01-01', count: 5 }]
    const values = rawData ? Object.keys(rawData).map(date => ({
        date: date,
        count: rawData[date]
    })) : [];

    return (
        <div className="heatmap-container">
            <CalendarHeatmap
                startDate={new Date('2025-12-31')}
                endDate={new Date('2026-12-31')}
                values={values}
                classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    // Đậm dần theo số lượng (tối đa mức 4)
                    return `color-github-${Math.min(value.count, 4)}`;
                }}
                // Hiển thị tooltip khi di chuột vào ô vuông
                tooltipDataAttrs={(value: any) => {
                    if (!value || !value.date) {
                        return { 'data-tooltip': 'Không có hoạt động' };
                    }
                    return {
                        'data-tooltip': `${value.date}: ${value.count} bài học`,
                    };
                }}
            />

            {/* CSS để định nghĩa dải màu xanh GitHub */}
            <style>{`
                .react-calendar-heatmap .color-empty { fill: #ebedf0; }
                .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
                .react-calendar-heatmap .color-github-2 { fill: #40c463; }
                .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
                .react-calendar-heatmap .color-github-4 { fill: #216e39; }
                
                .heatmap-container {
                    padding: 10px;
                    background: white;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
};

// Quan trọng nhất: Cần có dòng này để DashboardPage.tsx không báo lỗi "No matching export"
export default ActivityHeatMap;