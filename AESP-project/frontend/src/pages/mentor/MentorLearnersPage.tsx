import { useEffect, useState } from "react";
import { Card, Table, Avatar, Button, Space, Spin, Empty } from "antd";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";
import ChatModal from "../../components/chat/ChatModal";
import { getMentorProfile } from "../../api/mentorApi";
import { getMentorConversation } from "../../api/chatApi";

interface Learner {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  level?: string;
  score?: number;
}

export default function MentorLearnersPage() {
  const [loading, setLoading] = useState(true);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [chatLearner, setChatLearner] = useState<Learner | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [mentor, setMentor] = useState<any>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await getMentorProfile();
        setMentor(m);

        const res = await axiosClient.get("/mentor/learners");
        setLearners(Array.isArray(res) ? res : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spin />;

  return (
    <Card title="👥 Học viên phụ trách" style={{ borderRadius: 16 }}>
      {learners.length === 0 ? (
        <Empty description="Chưa có học viên nào" />
      ) : (
        <Table dataSource={learners} rowKey="id" pagination={false}>
          <Table.Column
            title="Học viên"
            render={(_, l: Learner) => (
              <Space>
                <Avatar src={l.avatarUrl} icon={<UserOutlined />} />
                {l.fullName}
              </Space>
            )}
          />
          <Table.Column title="Email" dataIndex="email" />
          <Table.Column title="Level" dataIndex="level" />
          <Table.Column
            title="Hành động"
            render={(_, l: Learner) => (
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={async () => {
                  try {
                    setChatLearner(l);

      
                    const convo = await getMentorConversation(l.id);
                    setConversationId(convo.id);

                    setChatOpen(true);
                  } catch {
                   
                  }
                }}
              >
                Chat
              </Button>
            )}
          />
        </Table>
      )}

      {/* CHAT MODAL */}
      {chatLearner && mentor && conversationId && (
        <ChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          conversationId={conversationId}
          currentUser={mentor}
          targetUser={chatLearner}
        />
      )}
    </Card>
  );
}
