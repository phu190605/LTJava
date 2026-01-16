import type { User } from "../types/user";

/* Lưu thông tin user vào localStorage (sau khi login)*/
export const login = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/*Xoá thông tin user khi logout*/
export const logout = () => {
  localStorage.removeItem("user");
};

/*Lấy thông tin user hiện tại từ localStorage*/
export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

/*Lấy mentorId nếu user hiện tại là mentor, ngược lại trả về null*/
export const getMentorId = (): string | null => {
  const user = getCurrentUser();
  return user?.role === "MENTOR" ? String(user.id) : null;
};
