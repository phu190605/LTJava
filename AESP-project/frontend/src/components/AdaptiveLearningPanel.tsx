import React, { useEffect } from 'react';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import './AdaptiveLearningPanel.css';

interface AdaptiveLearningPanelProps {
  userId: number;
  sessionData?: {
    pronunciationScore?: number;
    grammarScore?: number;
    phonemeScores?: Record<string, number>;
    weakGrammarTopics?: string[];
  };
}

/**
 * Component to display adaptive learning recommendations
 */
const AdaptiveLearningPanel: React.FC<AdaptiveLearningPanelProps> = ({ userId, sessionData }) => {
  const { loading, error, recommendations, recalculatePath, clearError } = useAdaptiveLearning();

  useEffect(() => {
    if (sessionData) {
      recalculatePath({
        userId,
        ...sessionData,
      });
    }
  }, [sessionData, userId, recalculatePath]);

  if (loading) {
    return (
      <div className="adaptive-panel loading">
        <div className="spinner"></div>
        <p>Analyzing your performance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adaptive-panel error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="adaptive-panel">
      <h2>Your Personalized Learning Path</h2>
      
      {recommendations.weakAreasIdentified.length > 0 && (
        <div className="weak-areas">
          <h3>Areas to Improve</h3>
          <ul>
            {recommendations.weakAreasIdentified.map((area, index) => (
              <li key={index} className="weak-area-item">
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="learning-path-status">
        <p>{recommendations.learningPathAdjusted}</p>
      </div>

      {recommendations.recommendedLessons.length > 0 && (
        <div className="recommended-lessons">
          <h3>Recommended Lessons</h3>
          <div className="lessons-grid">
            {recommendations.recommendedLessons.map((lesson) => (
              <div key={lesson.lessonId} className={`lesson-card priority-${lesson.priority}`}>
                <div className="lesson-header">
                  <h4>{lesson.title}</h4>
                  <span className="priority-badge">Priority: {lesson.priority}</span>
                </div>
                <p className="focus-area">{lesson.focusArea}</p>
                <p className="description">{lesson.description}</p>
                <button className="start-lesson-btn">Start Lesson</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveLearningPanel;
