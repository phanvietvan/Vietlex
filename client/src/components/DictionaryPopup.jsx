import React, { useState, useEffect } from 'react';

const DictionaryPopup = ({ word, onClose, onSave }) => {
    const [definition, setDefinition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDef = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
                const data = await res.json();
                if (data && data[0]) {
                    setDefinition({
                        phonetic: data[0].phonetic,
                        meaning: data[0].meanings[0].definitions[0].definition,
                        example: data[0].meanings[0].definitions[0].example
                    });
                } else {
                    setDefinition({ meaning: "Không tìm thấy định nghĩa cho từ này." });
                }
            } catch (err) {
                setDefinition({ meaning: "Lỗi kết nối từ điển." });
            } finally {
                setLoading(false);
            }
        };
        if (word) fetchDef();
    }, [word]);

    if (!word) return null;

    return (
        <div className="dictionary-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            <div className="glass-card dictionary-popup luminous-border" 
                 onClick={e => e.stopPropagation()} 
                 style={{ minWidth: '450px', padding: 0, overflow: 'hidden', borderRadius: '2rem' }}>
                
                {/* Wrapper đệm cưỡng bức */}
                <div style={{ padding: '3rem' }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                        <h2 className="text-gradient" style={{fontSize: '2.8rem', margin: 0, lineHeight: 1}}>{word}</h2>
                        <button className="icon-btn" onClick={onClose} style={{ padding: '8px' }}>
                            <span className="material-symbols-outlined" style={{fontSize: '2.2rem'}}>close</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="loader">Searching lexicon...</div>
                    ) : (
                        <div className="dict-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                            {definition?.phonetic && (
                                <div className="phonetic" style={{color: 'var(--secondary)', fontWeight: 700, fontSize: '1.1rem'}}>
                                    {definition.phonetic}
                                </div>
                            )}
                            
                            <div className="meaning-box">
                                <p className="meaning" style={{fontSize: '1.25rem', color: 'var(--on-surface)', opacity: 0.9, lineHeight: 1.6, margin: 0}}>
                                    {definition?.meaning}
                                </p>
                            </div>

                            {definition?.example && (
                                <div className="example" style={{
                                    fontStyle: 'italic', 
                                    color: 'var(--outline)', 
                                    borderLeft: '4px solid var(--primary)', 
                                    padding: '1.2rem 1.5rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '0 12px 12px 0',
                                    fontSize: '1.1rem'
                                }}>
                                    "{definition.example}"
                                </div>
                            )}
                            
                            <button 
                                className="btn-cta-v2 btn-primary-v2" 
                                style={{
                                    marginTop: '1rem', 
                                    width: '100%', 
                                    padding: '1.2rem', 
                                    borderRadius: '1.2rem',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                                onClick={() => onSave({
                                    word, 
                                    definition: definition.meaning, 
                                    pronunciation: definition.phonetic 
                                })}
                            >
                                <span className="material-symbols-outlined">bookmark</span>
                                Lưu vào sổ tay
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DictionaryPopup;
