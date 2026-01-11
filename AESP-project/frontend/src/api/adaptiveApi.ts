import axiosClient from './axiosClient';

export interface AdaptiveLearningRequest {
  userId: number;
  pronunciationScore?: number;
  grammarScore?: number;
  phonemeScores?: Record<string, number>;
  weakGrammarTopics?: string[];
}

export interface RecommendedLesson {
  lessonId: string;
  title: string;
  focusArea: string;
  description: string;
  priority: number;
}

export interface AdaptiveLearningResponse {
  message: string;
  recommendedLessons: RecommendedLesson[];
  weakAreasIdentified: string[];
  learningPathAdjusted: string;
}

export interface SessionStats {
  pronunciationScore?: number;
  grammarScore?: number;
  phonemeScores?: Record<string, number>;
  weakGrammarTopics?: string[];
}

/**
 * Recalculate learning path based on session statistics
 */
export const recalculateLearningPath = async (
  request: AdaptiveLearningRequest
): Promise<AdaptiveLearningResponse> => {
  const response = await axiosClient.post<AdaptiveLearningResponse>(
    '/api/v1/adaptive/recalc',
    request
  );
  return response.data;
};

/**
 * Trigger session completed event for async processing
 */
export const triggerSessionCompleted = async (
  userId: number,
  sessionStats: SessionStats
): Promise<{ message: string; userId: string }> => {
  const response = await axiosClient.post(
    `/api/v1/adaptive/session-completed?userId=${userId}`,
    sessionStats
  );
  return response.data;
}

export const moderationApi = {
  checkContent: async (content: string) => {
    const response = await fetch('/api/moderation/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) throw new Error('Moderation check failed');
    return await response.json();
  },
};
