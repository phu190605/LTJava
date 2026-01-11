export interface LearningSession {
  id: string;
  learnerId: string;
  topic: string;
  audioUrl: string;
  status: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
}

export interface MentorProfile {
  mentorId: string;
  fullName: string;
  bio: string;
  skills: string[];
  certificates: string[];
  avatarUrl?: string;
}
