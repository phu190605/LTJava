import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Skeleton } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import axiosClient from '../api/axiosClient';
import dayjs from 'dayjs'; // Thư viện xử lý ngày tháng (thường có sẵn hoặc npm install dayjs)

const { Title } = Typography;

const PaymentHistoryPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        // Gọi API bạn vừa viết
        axiosClient.get('/payment/history')
            .then((res: any) => setData(res))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'Gói dịch vụ',
            dataIndex: 'packageName',
            key: 'packageName',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) =>
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'SUCCESS' ? 'green' : 'red';
                let text = status === 'SUCCESS' ? 'Thành công' : 'Thất bại';
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={<><HistoryOutlined /> Lịch sử giao dịch</>}
                style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {loading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        locale={{ emptyText: 'Chưa có giao dịch nào' }}
                    />
                )}
            </Card>
        </div>
    );
};

export default PaymentHistoryPage;