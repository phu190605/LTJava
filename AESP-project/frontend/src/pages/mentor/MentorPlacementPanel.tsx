
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Select, Input, Modal, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { getAssessmentDetail } from "../../api/mentorApi";
import type { User } from "../../types/user";


interface PlacementLearner {
  profileId: number;
  user: User;
  assessmentScore: number;
  currentLevelCode: string;
  mentorNote?: string;
  assessmentId?: string;
}

interface AssessmentDetail {
  id: string;
  audioUrl?: string;
  transcript?: string;
  question?: string;
  answer?: string;
}

const { Option } = Select;


const MentorPlacementPanel = () => {
  const [learners, setLearners] = useState<PlacementLearner[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<PlacementLearner | null>(null);
  const [newLevel, setNewLevel] = useState("");
  const [mentorNote, setMentorNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [assessmentDetail, setAssessmentDetail] = useState<AssessmentDetail | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosClient.get("/mentor/placement-results")
      .then((data: any) => {
        console.log("DATA:", data);
        setLearners(data as PlacementLearner[]);
      })
      .catch(() => setLearners([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: "Học viên",
      key: "fullName",
      render: (_: any, record: PlacementLearner) => record.user?.fullName || ""
    },
    {
      title: "Email",
      key: "email",
      render: (_: any, record: PlacementLearner) => record.user?.email || ""
    },
    { title: "Điểm test", dataIndex: "assessmentScore", key: "score" },
    { title: "Level hiện tại", dataIndex: "currentLevelCode", key: "level" },
    {
      title: "Xếp lớp",
      render: (_: any, record: PlacementLearner) => (
        <Button type="primary" onClick={async () => {
          setSelectedLearner(record);
          setNewLevel(record.currentLevelCode || "");
          setMentorNote(record.mentorNote || "");
          setAssessmentDetail(null);
          setAssessmentLoading(true);
          setModalOpen(true);
          // Gọi API lấy chi tiết kiểm tra đầu vào
          try {
            // Nếu có assessmentId thì dùng, nếu không thì dùng profileId
            const id = record.assessmentId || record.profileId;
            const detail = await getAssessmentDetail(id.toString());
            setAssessmentDetail(detail);
          } catch {
            setAssessmentDetail(null);
          } finally {
            setAssessmentLoading(false);
          }
        }}>
          Đánh giá/Xếp lớp
        </Button>
      )
    }
  ];

  const handleEvaluate = async () => {
    if (!selectedLearner || !newLevel) return;
    try {
      await axiosClient.post("/mentor/placement-evaluate", null, {
        params: {
          learnerId: selectedLearner.user.id,
          newLevel,
          mentorNote
        }
      });
      message.success("Đã xếp lớp thành công!");
      setModalOpen(false);
      // Reload danh sách đúng cách, không clear learners trước khi có dữ liệu mới
      axiosClient.get("/mentor/placement-results")
        .then((data: any) => setLearners(data as PlacementLearner[]))
        .finally(() => setLoading(false));
    } catch {
      message.error("Lỗi xếp lớp!");
      setLoading(false);
    }
  };

  return (
    <Card title="Bài test đầu vào cần xếp lớp" style={{ marginTop: 24 }}>
      <Table
        dataSource={learners}
        columns={columns}
        rowKey={(record: PlacementLearner) => record.profileId}
        loading={loading}
        pagination={false}
        locale={{ emptyText: "Không có học viên cần xếp lớp" }}
      />
      <Modal
        open={modalOpen}
        title="Đánh giá & Xếp lớp học viên"
        onCancel={() => setModalOpen(false)}
        onOk={handleEvaluate}
        okText="Xác nhận"
      >
        <div style={{ marginBottom: 12 }}>
          <b>Học viên:</b> {selectedLearner?.user?.fullName}
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Level hiện tại:</b> {selectedLearner?.currentLevelCode}
        </div>
        {/* Thông tin kiểm tra đầu vào */}
        <div style={{ marginBottom: 16 }}>
          <b>Bài kiểm tra đầu vào:</b>
          {assessmentLoading ? (
            <Spin size="small" style={{ marginLeft: 8 }} />
          ) : (
            <div style={{ marginTop: 8 }}>
              {assessmentDetail?.question && (
                <div><b>Đề bài:</b> {assessmentDetail.question}</div>
              )}
              {assessmentDetail?.transcript && (
                <div><b>Transcript:</b> {assessmentDetail.transcript}</div>
              )}

              {(!assessmentDetail?.audioUrl && !assessmentDetail?.transcript && !assessmentDetail?.question) && (
                <div>Không có dữ liệu kiểm tra đầu vào.</div>
              )}
              <Button
                type="link"
                style={{ padding: 0, marginTop: 8 }}
                onClick={() => {
                  if (selectedLearner?.user?.id) {
                    navigate(`/review-all-results/${selectedLearner.user.id}`);
                  }
                }}
              >
                Xem chi tiết kết quả kiểm tra đầu vào
              </Button>
            </div>
          )}
        </div>
        <Select
          value={newLevel}
          onChange={setNewLevel}
          style={{ width: "100%", marginBottom: 12 }}
          placeholder="Chọn level mới"
        >
          <Option value="A1">A1</Option>
          <Option value="A2">A2</Option>
          <Option value="B1">B1</Option>
          <Option value="B2">B2</Option>
        </Select>
        <Input.TextArea
          value={mentorNote}
          onChange={e => setMentorNote(e.target.value)}
          rows={3}
          placeholder="Nhận xét của mentor (tuỳ chọn)"
        />
      </Modal>
    </Card>
  );
};

export default MentorPlacementPanel;