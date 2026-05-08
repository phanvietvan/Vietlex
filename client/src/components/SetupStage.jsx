import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const SetupStage = ({ rawText, setRawText, onStart, bestWpm, onStartMultiplayer }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');

  const sampleLessons = {
    ielts: "The academic version of IELTS is intended for those who want to enroll in universities and other institutions of higher education and for professionals such as medical doctors and nurses who want to study or practice in an English-speaking country.",
    daily: "Effective communication in daily life requires a good grasp of common idioms and phrases. Small talk about the weather, hobbies, and work helps build relationships and improves fluency in social situations.",
    tech: "Software development involves designing, coding, and maintaining computer programs. Key concepts like algorithms, data structures, and version control are essential for any modern programmer.",
    quotes: "Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do. Stay hungry, stay foolish."
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt && !isGenerating) return;
    setIsGenerating(true);
    setOcrStatus('AI đang soạn bài...');
    try {
        const response = await fetch('http://localhost:5000/api/generate-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: aiPrompt })
        });
        const data = await response.json();
        setRawText(data.content);
        setAiPrompt('');
    } catch (error) {
        setRawText(sampleLessons.ielts);
        alert("Kết nối Backend thất bại, đang dùng bài mẫu IELTS.");
    } finally {
        setIsGenerating(false);
        setOcrStatus('');
    }
  };

  const selectQuickTopic = (topic) => {
    const text = sampleLessons[topic];
    setRawText(text);
    // Tự động bắt đầu luôn để người dùng không phải nhấn Start lần nữa
    setTimeout(() => {
        onStart();
    }, 100);
  };

  const handleSRSReview = () => {
    const srsData = JSON.parse(localStorage.getItem('vietlex_srs')) || [];
    if (srsData.length === 0) return alert("Bạn chưa có từ khó nào để ôn tập!");
    const reviewText = srsData.sort((a, b) => b.mistakes - a.mistakes).slice(0, 15).map(item => item.word).join(' ');
    setRawText(`REVIEW WORDS: ${reviewText}`);
    setTimeout(() => {
        onStart();
    }, 100);
  };

  const handleOCR = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsGenerating(true);
    setOcrStatus('Đang quét...');
    try {
        const result = await Tesseract.recognize(file, 'eng+vie');
        setRawText(result.data.text.replace(/\n+/g, ' ').trim());
    } catch (error) {
        alert("Lỗi quét ảnh!");
    } finally {
        setIsGenerating(false);
        setOcrStatus('');
    }
  };

  const srsCount = (JSON.parse(localStorage.getItem('vietlex_srs')) || []).length;

  return (
    <div className="setup-container">
      <section className="text-center mb-16" style={{marginTop: '2rem'}}>
        <h1 className="hero-title text-glow">
          Elevate your <span className="text-gradient">vocabulary</span> <br/>
          through elite typing practice
        </h1>
        <p style={{fontSize: '1.1rem', color: 'var(--on-surface-variant)', maxWidth: '700px', margin: '0 auto', opacity: 0.8}}>
          Master academic English, daily idioms, and technical terms. Use AI to generate custom lessons or scan documents to build your personal lexicon.
        </p>
      </section>

      <div className="glass-card luminous-border ai-box-v2 group">
        <div className="flex-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem'}}>
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            AI Lesson Generator
          </h2>
          <span style={{fontSize: '0.7rem', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.1em'}}>VOCABULARY BUILDER</span>
        </div>

        <div className="ai-input-group-v2">
          <input 
            className="ai-input-v2" 
            placeholder="What do you want to learn? (e.g. Business English, IELTS...)"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <button className="btn-generate-v2 shimmer-container" onClick={handleGenerateAI} disabled={isGenerating}>
            {isGenerating ? (ocrStatus || 'Generating...') : 'Generate'}
            {!isGenerating && <span className="material-symbols-outlined" style={{fontSize: '1.2rem', marginLeft: '0.5rem'}}>bolt</span>}
          </button>
        </div>

        <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
            <button className="user-stats-pill interactive-el" onClick={() => selectQuickTopic('ielts')} style={{cursor: 'pointer', borderColor: 'var(--primary)'}}>
                <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>school</span>
                <span>IELTS Prep</span>
            </button>
            <button className="user-stats-pill interactive-el" onClick={() => selectQuickTopic('daily')} style={{cursor: 'pointer', borderColor: 'var(--secondary)'}}>
                <span className="material-symbols-outlined" style={{color: 'var(--secondary)'}}>chat</span>
                <span>Daily English</span>
            </button>
            <button className="user-stats-pill interactive-el" onClick={() => selectQuickTopic('tech')} style={{cursor: 'pointer', borderColor: 'var(--tertiary)'}}>
                <span className="material-symbols-outlined" style={{color: 'var(--tertiary)'}}>code</span>
                <span>Tech Terms</span>
            </button>
            <button className="user-stats-pill interactive-el" onClick={() => selectQuickTopic('quotes')} style={{cursor: 'pointer', borderColor: 'var(--outline)'}}>
                <span className="material-symbols-outlined">format_quote</span>
                <span>Inspiration</span>
            </button>
            
            <div style={{width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem'}}></div>

            <label className="user-stats-pill interactive-el" style={{cursor: 'pointer', background: 'rgba(255, 215, 0, 0.1)'}}>
                <span className="material-symbols-outlined">photo_camera</span>
                <span>{ocrStatus ? '⌛...' : 'Scan Document'}</span>
                <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleOCR} disabled={isGenerating}/>
            </label>
            
            {srsCount > 0 && (
                <button className="user-stats-pill interactive-el" onClick={handleSRSReview} style={{cursor: 'pointer', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171'}}>
                    <span className="material-symbols-outlined">history</span>
                    <span>Review Errors ({srsCount})</span>
                </button>
            )}
        </div>
      </div>

      <div className="feature-grid">
        <div className="glass-card luminous-border feature-card interactive-el">
          <div className="feature-icon-box icon-primary">
            <span className="material-symbols-outlined fill-icon">translate</span>
          </div>
          <h3>Vocab Builder</h3>
          <p>Contextual learning of high-frequency words through focused typing drills.</p>
        </div>
        <div className="glass-card luminous-border-secondary feature-card interactive-el">
          <div className="feature-icon-box icon-secondary">
            <span className="material-symbols-outlined fill-icon">history_edu</span>
          </div>
          <h3>Smart Dictionary</h3>
          <p>Click any word while typing to see instant definitions and add to your library.</p>
        </div>
        <div className="glass-card luminous-border feature-card interactive-el">
          <div className="feature-icon-box icon-tertiary">
            <span className="material-symbols-outlined fill-icon">military_tech</span>
          </div>
          <h3>Expert Leveling</h3>
          <p>Earn XP as you master complex sentence structures and advanced vocabulary.</p>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap'}}>
        <button className="btn-cta-v2 btn-primary-v2 interactive-el shimmer-container" onClick={onStart}>
          <span className="material-symbols-outlined" style={{fontSize: '2rem'}}>play_circle</span>
          Start Practice
        </button>
        <button className="btn-cta-v2 btn-secondary-v2 interactive-el shimmer-container" onClick={onStartMultiplayer}>
          <span className="material-symbols-outlined" style={{fontSize: '2rem', color: 'var(--tertiary)'}}>smart_toy</span>
          Race vs AI Bot
        </button>
      </div>
    </div>
  );
};

export default SetupStage;
