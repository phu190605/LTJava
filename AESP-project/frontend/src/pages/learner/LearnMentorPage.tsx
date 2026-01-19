import { useEffect, useState } from "react";
import { Spin, Typography, Divider } from "antd";
import { getMentorStatus } from "../../api/mentorStatusApi";
import UpgradeMentorPackage from "../../components/subscription/UpgradeMentorPackage";
import MentorList from "../../components/mentor/MentorList";

const { Title, Text } = Typography;

const LearnMentorPage = () => {
    const [loading, setLoading] = useState(true);
    const [hasMentor, setHasMentor] = useState(false);
    const [packageName, setPackageName] = useState<string | null>(null);

    useEffect(() => {
        getMentorStatus()
            .then((res: any) => {
                setHasMentor(res.hasMentor === true);
                setPackageName(res.packageName || null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Spin />;
    }

    // ❌ Chưa có gói mentor
    if (!hasMentor) {
        return <UpgradeMentorPackage />;
    }

    // ✅ Có gói mentor
    return (
        <div>
            <Title level={3}>Học với Mentor</Title>

            {packageName && (
                <Text type="secondary">
                    Gói hiện tại: <b>{packageName}</b>
                </Text>
            )}

            <Divider />

            {/* 📌 Danh sách mentor + chọn mentor */}
            <MentorList />
        </div>
    );
};

export default LearnMentorPage;
