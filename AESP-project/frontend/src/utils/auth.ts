import type { User } from "../types/user";

export const login = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role ?? null;
};

// ❌ KHÔNG DÙNG ID NỮA
export const getMentorId = (): null => {
  return null;
};
