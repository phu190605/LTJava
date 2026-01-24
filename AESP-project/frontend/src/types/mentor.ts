// Các session của mentor
export interface LearningSession {
  id: string;
  learnerId: string;
  mentorId: string;
  audioUrl: string;
  topic: string;
  status: "WAITING" | "ACTIVE" | "FINISHED";
}

// Feedback của mentor cho từng session
export interface Feedback {
  id?: string;
  sessionId: string;
  comment: string;
  grammarScore: number;
  pronunciationScore: number;
  timeStamp: number; // mốc thời gian tính bằng giây
}

// Tài liệu học tập upload bởi mentor
export interface LearningMaterial {
  id: string;
  title: string;
  mentorId: string;
  type: "PDF" | "AUDIO";
  fileUrl: string;
}

