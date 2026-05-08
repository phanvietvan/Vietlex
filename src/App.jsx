import React, { useState, useEffect, useCallback } from 'react';
import SetupStage from './components/SetupStage';
import LearningStage from './components/LearningStage';
import ResultStage from './components/ResultStage';
import './App.css';

function App() {
  const [mode, setMode] = useState('setup'); // 'setup', 'learning', 'finished'
  const [rawText, setRawText] = useState(() => localStorage.getItem('vietlex_last_text') || '');
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [bestWpm, setBestWpm] = useState(() => parseInt(localStorage.getItem('vietlex_best_wpm')) || 0);
  
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    startTime: null,
    totalCharsTyped: 0,
    correctCharsTyped: 0,
    mistakeCount: 0
  });

  // Handle Start Practice
  const handleStart = () => {
    const split = rawText
      .split(/(?<=[.!?])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    if (split.length === 0) {
      alert("Please paste some English text first!");
      return;
    }
    
    localStorage.setItem('vietlex_last_text', rawText);
    setSentences(split);
    setMode('learning');
    setCurrentIndex(0);
    setUserInput('');
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      startTime: Date.now(),
      totalCharsTyped: 0,
      correctCharsTyped: 0,
      mistakeCount: 0
    });
  };

  // Typing logic
  const handleInputChange = (e) => {
    const val = e.target.value;
    const currentSentence = sentences[currentIndex];
    
    // Don't allow typing beyond sentence length
    if (val.length > currentSentence.length) return;

    // Detect if the last character typed was an error
    if (val.length > userInput.length) {
      const lastCharIndex = val.length - 1;
      if (val[lastCharIndex] !== currentSentence[lastCharIndex]) {
        setStats(prev => ({ ...prev, mistakeCount: prev.mistakeCount + 1 }));
      }
    }

    setUserInput(val);

    // Calculate real-time stats
    const timeElapsed = (Date.now() - stats.startTime) / 1000 / 60; // minutes
    const totalTypedOverall = stats.totalCharsTyped + val.length;
    
    // Calculate current sentence correct chars
    let currentCorrect = 0;
    for(let i=0; i < val.length; i++) {
        if(val[i] === currentSentence[i]) currentCorrect++;
    }
    const totalCorrectOverall = stats.correctCharsTyped + currentCorrect;

    const newWpm = timeElapsed > 0 ? Math.round((totalTypedOverall / 5) / timeElapsed) : 0;
    const newAccuracy = totalTypedOverall > 0 
      ? Math.round((totalCorrectOverall / totalTypedOverall) * 100) 
      : 100;

    setStats(prev => ({
      ...prev,
      wpm: newWpm,
      accuracy: newAccuracy,
    }));

    // Auto-advance logic
    if (val === currentSentence) {
      setTimeout(() => {
        if (currentIndex < sentences.length - 1) {
          // Update base stats for the next sentence
          setStats(prev => ({
            ...prev,
            totalCharsTyped: prev.totalCharsTyped + currentSentence.length,
            correctCharsTyped: prev.correctCharsTyped + currentSentence.length
          }));
          setCurrentIndex(prev => prev + 1);
          setUserInput('');
        } else {
          // Finished all sentences
          setMode('finished');
          if (newWpm > bestWpm) {
            setBestWpm(newWpm);
            localStorage.setItem('vietlex_best_wpm', newWpm.toString());
          }
        }
      }, 150);
    }
  };

  const handleReset = () => {
    setMode('setup');
    setUserInput('');
  };

  return (
    <div className="app-container">
      <main className="content">
        {mode === 'setup' && (
          <SetupStage 
            rawText={rawText} 
            setRawText={setRawText} 
            onStart={handleStart} 
            bestWpm={bestWpm}
          />
        )}

        {mode === 'learning' && (
          <LearningStage 
            sentences={sentences}
            currentIndex={currentIndex}
            userInput={userInput}
            handleInputChange={handleInputChange}
            stats={stats}
            onBack={() => setMode('setup')}
          />
        )}

        {mode === 'finished' && (
          <ResultStage 
            stats={stats} 
            bestWpm={bestWpm} 
            onReset={handleReset} 
          />
        )}
      </main>
      
      <footer className="footer">
        Vietlex Typing Learning &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
