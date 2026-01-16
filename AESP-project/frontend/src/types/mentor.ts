/* ================== LEARNING SESSION ================== */
export interface LearningSession {
  id: string;
  learnerId: string;
  topic: string;
  audioUrl: string;
  status: string;
}

/* ================== MATERIAL ================== */
export interface LearningMaterial {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
}

/* ================== MENTOR PROFILE ================== */
export interface MentorProfile {
  mentorId: string;
  fullName: string;
  bio: string;
  skills: string[];
  certificates: string[];
  avatarUrl?: string;
}

/* ================== ASSESSMENT & LEVELING ================== */
export interface Assessment {
  id: number;         
  userId: number;      
  score: number;      
  feedback: string;    
  audioUrl?: string;  
  createdAt: string;  
}
