import axios from "axios";
import type {
  MentorProfile,
  LearningMaterial,
  Assessment,
} from "../types/mentor";

/* ================== BASE CONFIG ================== */

const BASE = "http://localhost:8080/api/mentor";

/* ================== DASHBOARD ================== */

export const getDashboard = (mentorId: string) =>
  axios.get(`${BASE}/dashboard`, {
    params: { mentorId },
  });

/* ================== ASSESSMENT & LEVELING ================== */
/** Danh sách học viên đã nộp bài test đầu vào */
export const getPendingAssessments = () =>
  axios.get<Assessment[]>(`${BASE}/assessments/pending`);

// Chi tiết 1 bài test
export const getAssessmentDetail = (assessmentId: number) =>
  axios.get<Assessment>(`${BASE}/assessments/${assessmentId}`);

// Mentor xác nhận xếp lớp
export const submitAssessment = (data: {
  assessmentId: number;   // sửa từ userId -> assessmentId
  finalLevel: string;
  mentorComment: string;
}) => axios.post(`${BASE}/assessments/submit`, data);

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
