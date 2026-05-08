import React from 'react';

const SetupStage = ({ rawText, setRawText, onStart, bestWpm }) => {
  return (
    <div className="glass-card setup-stage">
      <h1>Vietlex</h1>
      <p className="subtitle">Master English fluency through focused typing practice.</p>
      
      {bestWpm > 0 && (
        <div className="best-score-badge">
          <span>🏆 Best Speed: {bestWpm} WPM</span>
        </div>
      )}

      <div className="input-group">
        <label htmlFor="text-input">Paste your English text below</label>
        <textarea
          id="text-input"
          placeholder="Paste essays, news articles, or lyrics here..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Start Learning Mode
      </button>
      
      <div className="features-hint">
        <span>✓ Real-time accuracy</span>
        <span>✓ WPM tracking</span>
        <span>✓ Sentence splitting</span>
      </div>
    </div>
  );
};

export default SetupStage;
