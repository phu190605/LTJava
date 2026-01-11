import { useState } from 'react';
import {
  generateContent,
  generateQuickPractice,
} from '../api/contentGeneratorApi';
import type {
  GenerateContentRequest,
  GeneratedScenarioResponse,
} from '../api/contentGeneratorApi';

/**
 * Hook for AI content generation features
 */
export const useContentGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scenario, setScenario] = useState<GeneratedScenarioResponse | null>(null);

  /**
   * Generate custom scenario based on topic and weak points
   */
  const generateScenario = async (request: GenerateContentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateContent(request);
      setScenario(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate scenario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate quick practice for specific grammar point
   */
  const generateQuick = async (grammarPoint: string, level: string = 'intermediate') => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateQuickPractice(grammarPoint, level);
      setScenario(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate quick practice';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    scenario,
    generateScenario,
    generateQuick,
    clearError: () => setError(null),
    clearScenario: () => setScenario(null),
  };
};
