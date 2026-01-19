import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const UpgradeMentorPackage = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="info"
            title="Chức năng này cần gói Mentor"
            subTitle="Bạn chưa đăng ký gói có Mentor hỗ trợ."
            extra={
                <Button type="primary" onClick={() => navigate("/subscription")}>
                    Nâng cấp gói Mentor
                </Button>
            }
        />
    );
};

export default UpgradeMentorPackage;
