import { useEffect, useState } from "react";
import { getAllPayments } from "../../api/adminPaymentApi";

export default function PurchaseManager() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    getAllPayments().then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h2 style={title}>💳 Quản lý mua gói học</h2>

      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Gói</th>
              <th>Số tiền</th>
              <th>Ngày mua</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {list.map((p, i) => (
              <tr key={i}>
                <td>{p.learnerEmail}</td>
                <td>{p.packageName}</td>
                <td>{p.amount}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>
                  <span
                    style={{
                      ...status,
                      background:
                        p.status === "SUCCESS" ? "#dcfce7" : "#fee2e2",
                      color:
                        p.status === "SUCCESS" ? "#166534" : "#991b1b",
                    }}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const title: React.CSSProperties = {
  marginBottom: 20,
};

const tableWrapper: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const status: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 500,
};

