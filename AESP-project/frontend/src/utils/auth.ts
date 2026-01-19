// frontend/src/utils/auth.ts
import type { User } from "../types/user";

/* ======================
   LOGIN / LOGOUT
====================== */

// login: LƯU CẢ USER + TOKEN
export const login = (user: User, token: string) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

/* ======================
   GETTERS
====================== */

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getRole = (): string | null => {
  return getCurrentUser()?.role ?? null;
};

export const getMentorId = (): number | null => {
  const user = getCurrentUser();
  if (!user) return null;
  return user.role === "MENTOR" ? user.id : null;
};

/* ======================
   TOKEN (QUAN TRỌNG)
====================== */

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
