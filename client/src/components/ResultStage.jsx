import React from 'react';
import StatsGrid from './StatsGrid';

const ResultStage = ({ stats, bestWpm, xpGained, onReset }) => {
  return (
    <div className="glass-card result-screen">
      <div className="celebration-icon">🎉</div>
      <h1>Lesson Complete!</h1>
      <p className="subtitle">You're making great progress in your learning journey.</p>

      <div className="xp-reward-box" style={{
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '1rem',
          borderRadius: '15px',
          border: '1px solid var(--primary)',
          display: 'inline-block',
          marginBottom: '2rem',
          animation: 'bounce 1s infinite'
      }}>
          <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>✨ +{xpGained} XP GAINED</span>
      </div>
      
      <div className="final-stats-container">
        <StatsGrid stats={stats} />
      </div>

      <div className="best-score-badge">
        <span>🏆 Current Best: {bestWpm} WPM</span>
      </div>

      <button className="btn btn-primary" onClick={onReset} style={{ marginTop: '2rem' }}>
        Practice Another Topic
      </button>

      <style>{`
          @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
          }
      `}</style>
    </div>
  );
};

export default ResultStage;
