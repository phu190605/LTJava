import { useEffect, useState } from "react";
import axios from "axios";

const Register = () => {
  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [agree, setAgree] = useState(false);

  // Lấy Điều khoản & Chính sách từ backend
  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/policy/TERMS")
      .then(res => setTerms(res.data.content));

    axios.get("http://localhost:8080/api/auth/policy/PRIVACY")
      .then(res => setPrivacy(res.data.content));

  }, []);

  return (
    <div>
      <h2>Đăng ký</h2>

      {/* Điều khoản sử dụng */}
      <div>
        <h4>Điều khoản sử dụng</h4>
        <div>{terms}</div>
      </div>

      {/* Chính sách quyền riêng tư */}
      <div>
        <h4>Chính sách quyền riêng tư</h4>
        <div>{privacy}</div>
      </div>

      {/* Checkbox đồng ý */}
      <label>
        <input
          type="checkbox"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}
        />
        I agree
      </label>

      <br />

      {/* Nút đăng ký */}
      <button disabled={!agree}>
        Đăng ký
      </button>
    </div>
  );
};

export default Register;
