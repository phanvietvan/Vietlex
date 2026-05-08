import React from 'react';
import StatsGrid from './StatsGrid';

const ResultStage = ({ stats, bestWpm, onReset }) => {
  return (
    <div className="glass-card result-screen">
      <div className="celebration-icon">✨</div>
      <h1>Session Complete!</h1>
      <p className="subtitle">Great job! Here is how you performed.</p>

      <div className="final-stats-container">
        <StatsGrid 
          stats={stats} 
          currentIndex={-1} 
          totalSentences={0} 
          bestWpm={bestWpm} 
        />
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onReset}>
          Practice Again
        </button>
      </div>
    </div>
  );
};

export default ResultStage;
