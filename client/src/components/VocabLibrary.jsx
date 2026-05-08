import React, { useState, useEffect } from 'react';

const VocabLibrary = ({ onBack }) => {
    const [vocab, setVocab] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVocab = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/user/vocab');
                const data = await res.json();
                setVocab(data);
            } catch (err) {
                console.error("Lỗi tải từ vựng:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVocab();
    }, []);

    return (
        <div className="setup-container vocab-library">
            <header className="flex-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem'}}>
                <h1 className="hero-title text-gradient" style={{fontSize: '3rem', margin: 0}}>Your Lexicon</h1>
                <button className="btn-back" onClick={onBack}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            {loading ? (
                <div className="loader">Đang tải sổ tay...</div>
            ) : vocab.length === 0 ? (
                <div className="glass-card text-center" style={{padding: '5rem'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '5rem', color: 'var(--outline)', marginBottom: '1rem'}}>menu_book</span>
                    <p style={{fontSize: '1.2rem', color: 'var(--outline)'}}>Sổ tay của bạn đang trống. Hãy click vào các từ trong lúc luyện tập để lưu lại!</p>
                </div>
            ) : (
                <div className="vocab-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
                    {vocab.map((item, idx) => (
                        <div key={idx} className="glass-card luminous-border interactive-el" style={{padding: '1.5rem'}}>
                            <div className="flex-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                <h3 style={{margin: 0, fontSize: '1.4rem', color: 'var(--primary)'}}>{item.word}</h3>
                                <span style={{fontSize: '0.7rem', color: 'var(--outline)'}}>{new Date(item.addedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="phonetic" style={{fontSize: '0.9rem', color: 'var(--secondary)', margin: '0.5rem 0'}}>{item.pronunciation}</div>
                            <p style={{fontSize: '0.85rem', opacity: 0.8, lineLines: 3, overflow: 'hidden'}}>{item.definition}</p>
                            <div className="mastery-bar" style={{marginTop: '1.5rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}>
                                <div style={{width: `${item.mastery}%`, height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)'}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VocabLibrary;
