import React, { useState } from 'react';
import { useContentGenerator } from '../hooks/useContentGenerator';
import './ContentGeneratorPanel.css';

/**
 * Component for generating AI-powered practice scenarios
 */
const ContentGeneratorPanel: React.FC = () => {
  const { loading, error, scenario, generateScenario, generateQuick, clearError } = useContentGenerator();
  
  const [topic, setTopic] = useState('');
  const [weakPoints, setWeakPoints] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [quickGrammarPoint, setQuickGrammarPoint] = useState('');

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !weakPoints) return;

    const weakPointsArray = weakPoints.split(',').map(p => p.trim()).filter(p => p);
    
    await generateScenario({
      topic,
      weakPoints: weakPointsArray,
      difficultyLevel,
      numberOfDialogues: 8,
    });
  };

  const handleGenerateQuick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGrammarPoint) return;

    await generateQuick(quickGrammarPoint, difficultyLevel);
  };

  return (
    <div className="content-generator-panel">
      <h2>AI Practice Scenario Generator</h2>

      <div className="generator-forms">
        {/* Custom Scenario Generator */}
        <div className="form-section">
          <h3>Generate Custom Scenario</h3>
          <form onSubmit={handleGenerateCustom}>
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                type="text"
                placeholder="e.g., Business, Travel, Medical"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="weakPoints">Weak Points (comma separated)</label>
              <input
                id="weakPoints"
                type="text"
                placeholder="e.g., Past Tense, Vocabulary: Meeting"
                value={weakPoints}
                onChange={(e) => setWeakPoints(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="generate-btn">
              {loading ? 'Generating...' : 'Generate Scenario'}
            </button>
          </form>
        </div>

        {/* Quick Practice Generator */}
        <div className="form-section">
          <h3>Quick Grammar Practice</h3>
          <form onSubmit={handleGenerateQuick}>
            <div className="form-group">
              <label htmlFor="grammarPoint">Grammar Point</label>
              <input
                id="grammarPoint"
                type="text"
                placeholder="e.g., Present Perfect"
                value={quickGrammarPoint}
                onChange={(e) => setQuickGrammarPoint(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="generate-btn quick">
              {loading ? 'Generating...' : 'Quick Generate'}
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      {scenario && (
        <div className="scenario-display">
          <div className="scenario-header">
            <h3>{scenario.title}</h3>
            <span className="difficulty-badge">{scenario.difficultyLevel}</span>
          </div>

          <div className="scenario-context">
            <h4>Context</h4>
            <p>{scenario.context}</p>
          </div>

          <div className="learning-objective">
            <h4>Learning Objective</h4>
            <p>{scenario.learningObjective}</p>
          </div>

          {scenario.focusAreas && scenario.focusAreas.length > 0 && (
            <div className="focus-areas">
              <h4>Focus Areas</h4>
              <div className="focus-tags">
                {scenario.focusAreas.map((area, index) => (
                  <span key={index} className="focus-tag">{area}</span>
                ))}
              </div>
            </div>
          )}

          <div className="dialogue-section">
            <h4>Dialogue Practice</h4>
            <div className="dialogue-lines">
              {scenario.dialogueLines.map((line, index) => (
                <div key={index} className="dialogue-line">
                  <div className="dialogue-speaker">{line.speaker}</div>
                  <div className="dialogue-text">{line.text}</div>
                  {line.annotation && (
                    <div className="dialogue-annotation">
                      <span className="annotation-icon">💡</span>
                      {line.annotation}
                    </div>
                  )}
                  {line.keyPhrases && line.keyPhrases.length > 0 && (
                    <div className="key-phrases">
                      {line.keyPhrases.map((phrase, idx) => (
                        <span key={idx} className="key-phrase">{phrase}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="scenario-actions">
            <button className="practice-btn">Start Practicing</button>
            <button className="save-btn">Save Scenario</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGeneratorPanel;
