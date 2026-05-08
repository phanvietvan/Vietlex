import React, { useRef, useEffect, useState } from 'react';
import SentenceDisplay from './SentenceDisplay';
import StatsGrid from './StatsGrid';
import DictionaryPopup from './DictionaryPopup';

const LearningStage = ({ 
  sentences, 
  currentIndex, 
  userInput, 
  handleInputChange, 
  stats, 
  onBack 
}) => {
  const inputRef = useRef(null);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    if (inputRef.current && !selectedWord) {
      inputRef.current.focus();
    }
  }, [currentIndex, selectedWord]);

  const progress = (currentIndex / sentences.length) * 100;

  return (
    <div className="learning-layout">
      <div className="learning-header">
        <button className="back-btn" onClick={onBack}>
          <span className="icon">←</span> Exit Session
        </button>
        <div className="progress-wrapper">
          <div className="progress-label">Overall Progress: {Math.round(progress)}%</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <StatsGrid stats={stats} currentIndex={currentIndex} totalSentences={sentences.length} />

      <div className="glass-card typing-area" onClick={() => inputRef.current?.focus()}>
        <SentenceDisplay 
          sentence={sentences[currentIndex]} 
          userInput={userInput} 
          onWordClick={(word) => setSelectedWord(word)}
        />
        
        <input
          ref={inputRef}
          type="text"
          className="typing-input"
          value={userInput}
          onChange={handleInputChange}
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
      </div>

      <div className="typing-hint">
        Click on any <strong>word</strong> to see its definition • <kbd>Esc</kbd> to exit
      </div>

      {selectedWord && (
        <DictionaryPopup 
          word={selectedWord} 
          onClose={() => setSelectedWord(null)} 
        />
      )}
    </div>
  );
};

export default LearningStage;
