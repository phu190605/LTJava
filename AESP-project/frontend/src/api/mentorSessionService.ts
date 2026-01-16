import axios from "axios";
import type { LearningSession } from "../types/mentor";

/* ================= BASE ================= */

const BASE = "http://localhost:8080/api/mentor";

/* ================= SESSIONS ================= */

/**
 * Lấy danh sách session của mentor
 */
export const getSessionsByMentor = (mentorId: string) =>
  axios.get<LearningSession[]>(`${BASE}/sessions`, {
    params: { mentorId },
  });

/**
 * Lấy chi tiết session (audio, topic…)
 */
export const getSessionDetail = (sessionId: string) =>
  axios.get<LearningSession>(`${BASE}/sessions/${sessionId}`);

/* ================= FEEDBACK ================= */

/**
 * Gửi feedback cho learner
 * KHỚP MentorService.submitFeedback(...)
 */
export const submitSessionFeedback = (data: {
  sessionId: string;
  comment: string;
  grammarScore: number;
  pronunciationScore: number;
  timeStamp: string;
}) =>
  axios.post(`${BASE}/feedback`, data);

/**
 * Lấy feedback theo session
 */
export const getSessionFeedback = (sessionId: string) =>
  axios.get(`${BASE}/feedback/${sessionId}`);
