import React, { useState, useEffect, useCallback } from 'react';
import SetupStage from './components/SetupStage';
import LearningStage from './components/LearningStage';
import ResultStage from './components/ResultStage';
import DictionaryPopup from './components/DictionaryPopup';
import VocabLibrary from './components/VocabLibrary';
import './App.css';

function App() {
  const [mode, setMode] = useState('setup'); // 'setup', 'learning', 'finished', 'library'
  const [selectedWord, setSelectedWord] = useState(null);
  const [rawText, setRawText] = useState(() => localStorage.getItem('vietlex_last_text') || '');
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [bestWpm, setBestWpm] = useState(() => parseInt(localStorage.getItem('vietlex_best_wpm')) || 0);
  
  const [stats, setStats] = useState({
    wpm: 0, accuracy: 100, errors: 0, startTime: null, totalCharsTyped: 0, correctCharsTyped: 0, mistakeCount: 0
  });

  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('vietlex_xp')) || 0);
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('vietlex_level')) || 1);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  const syncStatsWithBackend = async (xpGained, mistakes = []) => {
    try {
        const response = await fetch('http://localhost:5000/api/user/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xpGained, mistakes })
        });
        const data = await response.json();
        setXp(data.xp);
        setLevel(data.level);
    } catch (error) { console.warn("Backend sync failed."); }
  };

  const handleSaveVocab = async (vocabData) => {
    try {
        const response = await fetch('http://localhost:5000/api/user/vocab', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vocabData)
        });
        if (response.ok) {
            alert(`Đã lưu từ "${vocabData.word}" vào sổ tay!`);
            setSelectedWord(null);
        }
    } catch (error) { console.error("Lỗi lưu từ vựng:", error); }
  };

  useEffect(() => { syncStatsWithBackend(0); }, []);

  const handleStart = () => {
    const split = rawText.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 0);
    if (split.length === 0) return alert("Hãy nhập văn bản trước!");
    localStorage.setItem('vietlex_last_text', rawText);
    setSentences(split);
    setMode('learning');
    setCurrentIndex(0);
    setUserInput('');
    setStats({ wpm: 0, accuracy: 100, errors: 0, startTime: Date.now(), totalCharsTyped: 0, correctCharsTyped: 0, mistakeCount: 0 });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    const currentSentence = sentences[currentIndex];
    if (val.length > currentSentence.length) return;
    if (val.length > userInput.length) {
      if (val[val.length - 1] !== currentSentence[val.length - 1]) {
        setStats(prev => ({ ...prev, mistakeCount: prev.mistakeCount + 1 }));
      }
    }
    setUserInput(val);
    const timeElapsed = (Date.now() - stats.startTime) / 1000 / 60;
    const totalTypedOverall = stats.totalCharsTyped + val.length;
    let currentCorrect = 0;
    for(let i=0; i < val.length; i++) if(val[i] === currentSentence[i]) currentCorrect++;
    const totalCorrectOverall = stats.correctCharsTyped + currentCorrect;
    const newWpm = timeElapsed > 0 ? Math.round((totalTypedOverall / 5) / timeElapsed) : 0;
    const newAccuracy = totalTypedOverall > 0 ? Math.round((totalCorrectOverall / totalTypedOverall) * 100) : 100;
    setStats(prev => ({ ...prev, wpm: newWpm, accuracy: newAccuracy }));

    if (val === currentSentence) {
      const gainedXp = Math.round(currentSentence.length / 2);
      addXp(gainedXp);
      setTimeout(() => {
        if (currentIndex < sentences.length - 1) {
          setStats(prev => ({ ...prev, totalCharsTyped: prev.totalCharsTyped + currentSentence.length, correctCharsTyped: prev.correctCharsTyped + currentSentence.length }));
          setCurrentIndex(prev => prev + 1);
          setUserInput('');
        } else {
          setMode('finished');
          if (newWpm > bestWpm) {
            setBestWpm(newWpm);
            localStorage.setItem('vietlex_best_wpm', newWpm.toString());
          }
        }
      }, 150);
    }
  };

  const addXp = (amount) => {
    const newXp = xp + amount;
    setXp(newXp);
    syncStatsWithBackend(amount);
    const nextLevelThreshold = level * 200;
    if (newXp >= nextLevelThreshold) setLevel(prev => prev + 1);
  };

  const handleReset = () => { setMode('setup'); setUserInput(''); };

  return (
    <div className="app-main-wrapper">
      <div className="ambient-container">
        <div className="bg-glow-1"></div><div className="bg-glow-2"></div><div className="bg-glow-3"></div>
      </div>

      <header className="main-header shadow-lg">
        <div className="flex-row" style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
          <span className="logo text-gradient text-glow" onClick={() => setMode('setup')} style={{cursor: 'pointer'}}>Vietlex</span>
          <nav className="nav-links">
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setMode('setup'); }}>Dashboard</a>
            <a href="#" className="nav-link">Academy</a>
            <a href="#" className="nav-link">Multiplayer</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setMode('library'); }}>Library</a>
          </nav>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div className="user-stats-pill shadow-lg shadow-primary/5">
            <span className="material-symbols-outlined fill-icon" style={{color: 'var(--tertiary)'}}>local_fire_department</span>
            <span>12 Day Streak</span>
          </div>
          <div className="user-stats-pill shadow-lg shadow-primary/5">
            <span className="material-symbols-outlined fill-icon" style={{color: 'var(--secondary)'}}>military_tech</span>
            <span>Level {level}</span>
          </div>
          <div className="avatar-mock interactive-el" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--secondary))', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}></div>
        </div>
      </header>

      <main className="app-content relative">
        {mode === 'setup' && (
          <SetupStage 
            rawText={rawText} setRawText={setRawText} onStart={handleStart} bestWpm={bestWpm}
            onStartMultiplayer={() => { setIsMultiplayer(true); handleStart(); }}
          />
        )}

        {mode === 'library' && (
          <VocabLibrary onBack={() => setMode('setup')} />
        )}

        {mode === 'learning' && (
          <div className={isZenMode ? 'zen-active' : ''}>
            <div className="ecosystem-header" style={{display: isZenMode ? 'none' : 'flex'}}>
                <div className="level-badge">LVL {level}</div>
                <div className="xp-bar-container">
                    <div className="xp-progress" style={{ width: `${(xp % (level * 200)) / (level * 200) * 100}%` }}></div>
                </div>
                <button className="zen-toggle" onClick={() => setIsZenMode(!isZenMode)}>
                    {isZenMode ? 'Exit Zen' : 'Zen Mode'}
                </button>
            </div>
            <LearningStage 
                sentences={sentences} currentIndex={currentIndex} userInput={userInput} handleInputChange={handleInputChange} stats={stats} isMultiplayer={isMultiplayer}
                onBack={() => { setMode('setup'); setIsMultiplayer(false); }}
                onWordClick={setSelectedWord}
            />
          </div>
        )}

        {mode === 'finished' && (
          <ResultStage stats={stats} bestWpm={bestWpm} xpGained={Math.round(stats.totalCharsTyped / 2)} onReset={handleReset} />
        )}
      </main>

      {selectedWord && (
        <DictionaryPopup word={selectedWord} onClose={() => setSelectedWord(null)} onSave={handleSaveVocab} />
      )}

      <footer className="main-footer">
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}><span style={{fontWeight: 800, fontSize: '1.2rem'}} className="text-glow">Vietlex Typing</span><span style={{color: 'var(--outline)', fontSize: '0.85rem'}}>© {new Date().getFullYear()} All rights reserved.</span></div>
        <div className="nav-links"><a href="#" className="nav-link">Terms</a><a href="#" className="nav-link">Privacy</a><a href="#" className="nav-link">Support</a><a href="#" className="nav-link">API</a></div>
      </footer>
    </div>
  );
}

export default App;
