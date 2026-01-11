import axiosClient from './axiosClient';

export interface GenerateContentRequest {
  topic: string;
  weakPoints: string[];
  difficultyLevel?: string;
  numberOfDialogues?: number;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  annotation?: string;
  keyPhrases?: string[];
}

export interface GeneratedScenarioResponse {
  title: string;
  context: string;
  topic: string;
  difficultyLevel: string;
  dialogueLines: DialogueLine[];
  focusAreas: string[];
  learningObjective: string;
}

/**
 * Generate AI-powered remedial exercise
 */
export const generateContent = async (
  request: GenerateContentRequest
): Promise<GeneratedScenarioResponse> => {
  const response = await axiosClient.post<GeneratedScenarioResponse>(
    '/api/v1/content/generate',
    request
  );
  return response.data;
};

/**
 * Generate quick practice scenario for specific grammar point
 */
export const generateQuickPractice = async (
  grammarPoint: string,
  level: string = 'intermediate'
): Promise<GeneratedScenarioResponse> => {
  const response = await axiosClient.get<GeneratedScenarioResponse>(
    '/api/v1/content/quick-practice',
    {
      params: { grammarPoint, level }
    }
  );
  return response.data;
};
