export interface LoginResponse {
    token: string;
    id: number;
    email: string;
    fullName: string;
    role: "ADMIN" | "MENTOR" | "LEARNER";
}
