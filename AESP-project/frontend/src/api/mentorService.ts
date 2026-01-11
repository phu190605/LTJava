import axios from "axios";
import type {
  MentorProfile,
  LearningMaterial,
  LearningSession,
} from "../types/mentor";

/* ================== BASE CONFIG ================== */

const BASE = "http://localhost:8080/api/mentor";

/* ================== DASHBOARD ================== */

export const getDashboard = (mentorId: string) =>
  axios.get(`${BASE}/dashboard`, {
    params: { mentorId },
  });

/* ================== ASSESSMENT & LEVELING ================== */

/**
 * Lấy danh sách bài test đầu vào của học viên
 */
export const getSessions = (mentorId: string) =>
  axios.get<LearningSession[]>(`${BASE}/sessions/${mentorId}`);

/**
 * Lấy chi tiết feedback + AI score của 1 session
 */
export const getFeedback = (sessionId: string) =>
  axios.get(`${BASE}/feedback/${sessionId}`);

/**
 * Mentor chấm bài & xếp lớp
 */
export const submitFeedback = (data: {
  sessionId: string;
  level: string;
  comment: string;
}) =>
  axios.post(`${BASE}/feedback`, data);

/* ================== MATERIALS ================== */

/**
 * Lấy toàn bộ tài liệu mentor đã upload
 */
export const getMaterials = () =>
  axios.get<LearningMaterial[]>(`${BASE}/materials`);

/**
 * Upload tài liệu mới
 */
export const uploadMaterial = (form: FormData) =>
  axios.post(`${BASE}/materials`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* ================== PROFILE ================== */

/**
 * Lấy profile mentor
 */
export const getProfile = (mentorId: string) =>
  axios.get<MentorProfile>(`${BASE}/profile/${mentorId}`);

/**
 * Cập nhật profile mentor
 */
export const updateProfile = (data: {
  mentorId: string;
  fullName: string;
  bio: string;
}) =>
  axios.put(`${BASE}/profile`, data);
