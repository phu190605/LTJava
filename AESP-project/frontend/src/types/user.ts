// frontend/src/types/user.ts
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: "MENTOR" | "LEARNER" | "ADMIN";
  token?: string;
}
