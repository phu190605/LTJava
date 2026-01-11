export interface User {
  id: number;
  name: string;
  email: string;
  role:  "MENTOR" | "LEARNER" | "ADMIN";
  active: boolean;
}
