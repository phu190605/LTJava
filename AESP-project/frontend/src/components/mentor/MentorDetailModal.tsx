import { Modal } from "antd";
import MentorProfileView from "./MentorProfileView";
import type { Mentor } from "../../api/mentorPublicApi";

interface Props {
    mentor: Mentor | null;
    open: boolean;
    onClose: () => void;
}

const MentorDetailModal = ({ mentor, open, onClose }: Props) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {mentor && <MentorProfileView mentor={mentor} />}
        </Modal>
    );
};

export default MentorDetailModal;
