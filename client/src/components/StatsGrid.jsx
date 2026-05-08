import React from 'react';

const StatsGrid = ({ stats, currentIndex, totalSentences, bestWpm }) => {
  return (
    <div className="stats-grid">
      <div className="stat-item">
        <span className="stat-value">{stats.wpm}</span>
        <span className="stat-label">WPM</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.accuracy}%</span>
        <span className="stat-label">Accuracy</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{currentIndex + 1}/{totalSentences}</span>
        <span className="stat-label">Sentence</span>
      </div>
      {bestWpm !== undefined && (
        <div className="stat-item best-wpm">
          <span className="stat-value">{bestWpm}</span>
          <span className="stat-label">Best WPM</span>
        </div>
      )}
    </div>
  );
};

export default StatsGrid;
