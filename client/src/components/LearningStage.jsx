import React, { useRef, useEffect, useState } from 'react';

const LearningStage = ({ 
  sentences, 
  currentIndex, 
  userInput, 
  handleInputChange, 
  stats, 
  isMultiplayer,
  onBack,
  onWordClick
}) => {
  const inputRef = useRef(null);
  const currentSentence = sentences[currentIndex];
  const progress = Math.round((currentIndex / sentences.length) * 100);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const renderWords = () => {
    return currentSentence.split(' ').map((word, idx) => (
      <span 
        key={idx} 
        className="clickable-word" 
        onClick={(e) => {
            e.stopPropagation();
            onWordClick(word.replace(/[.,!?]/g, ''));
        }}
        style={{ color: 'inherit', display: 'inline-block', marginRight: '0.4em' }}
      >
        {word}
      </span>
    ));
  };

  const renderCharFeedback = () => {
    return currentSentence.split('').map((char, index) => {
        let className = "upcoming-text";
        if (index < userInput.length) {
            className = userInput[index] === char ? "text-primary" : "text-error";
        } else if (index === userInput.length) {
            className = "current-char-blink";
        }
        return <span key={index} className={className}>{char}</span>;
    });
  };

  return (
    <div className="learning-stage-premium flex flex-col items-center w-full px-4" style={{paddingTop: '5vh'}}>
      {/* Top Utility Bar */}
      <div className="w-full max-w-5xl flex justify-between items-end mb-8 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">LVL {Math.floor(stats.totalCharsTyped / 1000) + 1}</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] border border-white/10 text-slate-300">ZEN FOCUS</span>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
            <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>arrow_back</span>
            Exit Session
          </button>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Your Progress: <span className="text-white font-bold">{progress}%</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Stats Sidebar */}
        <div className="lg:w-40 flex lg:flex-col gap-10 py-6">
          <div className="stat-group">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">WPM</div>
            <div className="text-4xl font-extrabold text-white text-glow">{stats.wpm}</div>
          </div>
          <div className="stat-group">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Accuracy</div>
            <div className="text-4xl font-extrabold text-white text-glow">{stats.accuracy}%</div>
          </div>
          <div className="stat-group">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Sentence</div>
            <div className="text-2xl font-bold text-slate-300">{currentIndex + 1} <span className="text-slate-600">/ {sentences.length}</span></div>
          </div>
        </div>

        {/* Typing Card */}
        <div className="flex-grow glass-card rounded-[2rem] p-12 relative overflow-hidden shadow-2xl" 
             style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
             onClick={() => inputRef.current?.focus()}>
          
          <div className="text-3xl md:text-4xl leading-relaxed text-left font-light select-none relative z-10" style={{ letterSpacing: '0.02em' }}>
            {/* Word Layer for Dictionary - Individual Hover controlled via CSS */}
            <div className="word-layer mb-8">
                {renderWords()}
            </div>
            
            {/* Real-time Feedback Layer */}
            <div className="feedback-layer typing-text-display font-medium">
                {renderCharFeedback()}
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            value={userInput}
            onChange={handleInputChange}
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />

          <div className="mt-16 pt-8 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{fontSize: '16px', color: 'var(--primary)'}}>lightbulb</span>
                <span>Click on any <span className="text-slate-300 font-bold">word</span> for instant dictionary definition</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Live Session Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStage;
