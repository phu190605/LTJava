import { useEffect, useState } from "react";
import { Row, Col, Spin, message } from "antd";
import MentorCard from "./MentorCard";
import MentorDetailModal from "./MentorDetailModal";
import { getAllMentors } from "../../api/mentorPublicApi";
import { getSelectedMentor } from "../../api/learnerMentorApi";
import type { Mentor } from "../../api/mentorPublicApi";

const MentorList = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // 👇 STATE MỚI
    const [openDetail, setOpenDetail] = useState(false);
    const [viewMentor, setViewMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        Promise.all([
            getAllMentors(),
            getSelectedMentor()
        ])
            .then(([mentorList, selected]) => {
                setMentors(mentorList);
                if (selected) setSelectedMentorId(selected.id);
            })
            .catch(() => {
                message.error("Không thể tải danh sách mentor");
            })
            .finally(() => setLoading(false));
    }, []);

    // 👇 CLICK MENTOR → XEM PROFILE
    const handleViewMentor = (mentor: Mentor) => {
        setViewMentor(mentor);
        setOpenDetail(true);
    };

    if (loading) return <Spin />;

    return (
        <>
            <Row gutter={[24, 24]}>
                {mentors.map((mentor) => (
                    <Col key={mentor.id}>
                        <div
                            onClick={() => handleViewMentor(mentor)}
                            style={{ cursor: "pointer" }}
                        >
                            <MentorCard
                                mentor={mentor}
                                selected={mentor.id === selectedMentorId}
                                disabled={
                                    selectedMentorId !== null &&
                                    mentor.id !== selectedMentorId
                                }
                            />
                        </div>
                    </Col>
                ))}
            </Row>

            {/* ✅ MODAL CHI TIẾT */}
            <MentorDetailModal
                mentor={viewMentor}
                open={openDetail}
                onClose={() => setOpenDetail(false)}
            />
        </>
    );
};

export default MentorList;
