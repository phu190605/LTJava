import axiosClient from "./axiosClient";

/**
 * Learning Path API endpoints
 * Quản lý lộ trình học của người dùng
 */

// ===== 0. ĐĂNG KÝ LEARNING PATH MỚI =====
/**
 * POST /api/learning-path/enroll
 * Đăng ký user vào learning path theo level, goal, topic
 * Request body: { level: "A1", goalCode: "CAREER", topicCode: "COOKING" }
 */
export const enrollLearningPath = async (data: {
  level: string;
  goalCode: string;
  topicCode: string;
}): Promise<any> => {
  return axiosClient.post("/learning-path/enroll", data);
};

// ===== 0a. LẤY LEARNING PATH CỦA USER HIỆN TẠI =====
/**
 * GET /api/learning-path/my-path
 * Lấy learning path đã enroll của user (lộ trình học được lưu)
 */
export const getUserLearningPath = async (): Promise<UserLearningPathResponse | null> => {
  return axiosClient.get("/learning-path/my-path");
};

// ===== 1. TẠO LEARNING PATH MỚI =====
/**
 * POST /api/learning-path/create
 * Tạo learning path mới
 */
export const createLearningPath = async (data: {
  level: string;
  goalCode: string;
  topicCode: string;
  description: string;
}): Promise<LearningPathResponse> => {
  return axiosClient.post("/learning-path/create", data);
};

// ===== 2. LẤY LEARNING PATH THEO ID =====
/**
 * GET /api/learning-path/:pathId
 */
export const getLearningPathById = async (pathId: number): Promise<LearningPathResponse> => {
  return axiosClient.get(`/learning-path/${pathId}`);
};

// ===== 3. LẤY LEARNING PATHS THEO LEVEL =====
/**
 * GET /api/learning-path/by-level/:level
 */
export const getLearningPathsByLevel = async (level: string): Promise<LearningPathResponse[]> => {
  return axiosClient.get(`/learning-path/by-level/${level}`);
};

// ===== 4. LẤY LEARNING PATHS THEO GOAL CODE =====
/**
 * GET /api/learning-path/by-goal/:goalCode
 */
export const getLearningPathsByGoalCode = async (goalCode: string): Promise<LearningPathResponse[]> => {
  return axiosClient.get(`/learning-path/by-goal/${goalCode}`);
};

// ===== 5. LẤY LEARNING PATHS THEO TOPIC CODE =====
/**
 * GET /api/learning-path/by-topic/:topicCode
 */
export const getLearningPathsByTopicCode = async (topicCode: string): Promise<LearningPathResponse[]> => {
  return axiosClient.get(`/learning-path/by-topic/${topicCode}`);
};

// ===== 6. TÌM KIẾM LEARNING PATH =====
/**
 * GET /api/learning-path/search?level=:level&goalCode=:goalCode&topicCode=:topicCode
 */
export const searchLearningPath = async (
  level: string,
  goalCode: string,
  topicCode: string
): Promise<LearningPathResponse> => {
  return axiosClient.get("/learning-path/search", {
    params: { level, goalCode, topicCode }
  });
};

// ===== 7. LẤY NỘI DUNG LỘ TRÌNH (VOCAB QUESTIONS) =====
/**
 * GET /api/learning-path/:pathId/content
 * Lấy nội dung lộ trình (danh sách vocab questions)
 */
export const getPathContent = async (pathId: number): Promise<PathContentResponse> => {
  return axiosClient.get(`/learning-path/${pathId}/content`);
};

// ===== 8. SUBMIT VOCAB QUESTION SCORE (Reuses Speaking Test Logic) =====
/**
 * POST /api/learning-path/submit-question-score
 * Submit một câu trả lời vocab question với điểm số
 */
export const submitQuestionScore = async (data: {
  enrollmentId: number;
  questionId: number;
  userAnswer: string;
  score: number;
  audioUrl?: string;
}): Promise<QuestionScoreResponse> => {
  return axiosClient.post("/learning-path/submit-question-score", data);
};

// ===== 9. GET ENROLLMENT PROGRESS =====
/**
 * GET /api/learning-path/:enrollmentId/progress
 * Get enrollment progress and statistics
 */
export const getEnrollmentProgress = async (enrollmentId: number): Promise<ProgressResponse> => {
  return axiosClient.get(`/learning-path/${enrollmentId}/progress`);
};

// ===== 10. GET WORD DETAILS FROM SPEECH ASSESSMENT =====
/**
 * GET /api/speech/detail/{speechAssessmentId}
 * Get word-level details for a speech assessment with pronunciation, meaning, examples
 */
export const getSpeechAssessmentDetail = async (speechAssessmentId: number): Promise<any> => {
  return axiosClient.get(`/speech/detail/${speechAssessmentId}`);
};

// ===== 11. SAVE SPEECH ASSESSMENT RESULT =====
/**
 * POST /api/learning-path/save-speech-assessment
 * Save speech assessment result directly to vocab_question_attempts
 * Called after user completes pronunciation question on LearningPathPage
 */
export const saveSpeechAssessment = async (
  enrollmentId: number,
  questionId: number,
  score: number,
  transcription?: string,
  audioUrl?: string
): Promise<any> => {
  return axiosClient.post("/learning-path/save-speech-assessment", null, {
    params: {
      enrollmentId,
      questionId,
      score,
      transcription: transcription || "",
      audioUrl: audioUrl || ""
    }
  });
};

// ===== Type Definitions =====
export interface LearningPathResponse {
  pathId: number;
  level: string;
  goalCode: string;
  topicCode: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLearningPathResponse extends LearningPathResponse {
  enrollmentId: number;
  progress: number;
  status: string;
  startedAt: string;
}

export interface VocabQuestion {
  id: number;
  question: string;
  answer: string;
  choices: string[];
}

export interface PathContentResponse extends LearningPathResponse {
  totalQuestions: number;
  questions: VocabQuestion[];
}

export interface QuestionScoreResponse {
  attemptId: number;
  questionId: number;
  enrollmentId: number;
  userAnswer: string;
  score: number;
  correctAnswer: string;
  attemptCount: number;
  timestamp: string;
}

export interface ProgressResponse {
  enrollmentId: number;
  averageScore: number;
}

export interface QuestionScoreResponse {
  attemptId: number;
  questionId: number;
  enrollmentId: number;
  userAnswer: string;
  score: number;
  correctAnswer: string;
  attemptCount: number;
  timestamp: string;
}

export interface ProgressResponse {
  enrollmentId: number;
  averageScore: number;
}

export interface QuestionScoreResponse {
  attemptId: number;
  questionId: number;
  enrollmentId: number;
  userAnswer: string;
  score: number;
  correctAnswer: string;
  attemptCount: number;
  timestamp: string;
}

export interface ProgressResponse {
  enrollmentId: number;
  averageScore: number;
}
