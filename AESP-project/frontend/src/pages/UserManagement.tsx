import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import '../css/user-management.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/admin/users"); // → http://localhost:8080/api/admin/users
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      console.error("Lỗi fetch users:", err);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const disableUser = async (id: number) => {
    try {
      await axiosClient.put(`/admin/users/${id}/disable`);
      fetchUsers(); // load lại danh sách
    } catch (err) {
      console.error("Lỗi disable user:", err);
      alert("Disable user thất bại");
    }
  };

  if (loading) return <p>Đang tải danh sách người dùng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-management">
      <h2>User Management</h2>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <span
                  className={u.active ? "status-active" : "status-disabled"}
                >
                  {u.active ? "Active" : "Disabled"}
                </span>
              </td>
              <td>
                {u.active && (
                  <button
                    className="btn-disable"
                    onClick={() => disableUser(u.id)}
                  >
                    Disable
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
