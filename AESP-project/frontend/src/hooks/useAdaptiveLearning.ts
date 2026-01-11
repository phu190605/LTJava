import { useState } from 'react';
import {
  recalculateLearningPath,
  triggerSessionCompleted,
} from '../api/adaptiveApi';
import type {
  AdaptiveLearningRequest,
  AdaptiveLearningResponse,
  SessionStats,
} from '../api/adaptiveApi';

/**
 * Hook for adaptive learning features
 */
export const useAdaptiveLearning = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AdaptiveLearningResponse | null>(null);

  /**
   * Recalculate learning path and get recommendations
   */
  const recalculatePath = async (request: AdaptiveLearningRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await recalculateLearningPath(request);
      setRecommendations(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to recalculate learning path';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger session completed event (async)
   */
  const completeSession = async (userId: number, sessionStats: SessionStats) => {
    setLoading(true);
    setError(null);
    try {
      const response = await triggerSessionCompleted(userId, sessionStats);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to trigger session completion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    recommendations,
    recalculatePath,
    completeSession,
    clearError: () => setError(null),
    clearRecommendations: () => setRecommendations(null),
  };
};
