import React, { useEffect, useState } from "react";
import { Card, Typography, Spin } from "antd";
import { getLearningPath } from "../api/learningPathApi";
import { useParams } from "react-router-dom";

const { Title, Paragraph } = Typography;

const LearningPathPage: React.FC = () => {
  const { learnerId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!learnerId) return;

    getLearningPath(Number(learnerId))
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [learnerId]);

  if (loading) return <Spin fullscreen />;

  if (!data) return <Paragraph>Chưa có lộ trình học</Paragraph>;

  return (
    <Card style={{ maxWidth: 700, margin: "40px auto" }}>
      <Title level={2}>Lộ trình học cá nhân</Title>
      <Paragraph><b>Mục tiêu:</b> {data.goal}</Paragraph>
      <Paragraph><b>Ngành nghề:</b> {data.industry}</Paragraph>
      <Paragraph><b>Trình độ:</b> {data.level}</Paragraph>
      <Paragraph><b>Trạng thái:</b> {data.status}</Paragraph>
    </Card>
  );
};

export default LearningPathPage;
