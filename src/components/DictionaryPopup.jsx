import React, { useState, useEffect } from 'react';

const DictionaryPopup = ({ word, onClose }) => {
  const [data, setData] = useState(null);
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!word) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // Clean word: remove special chars at start/end, but keep internal hyphens for phrase translation
      const cleanWord = word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      
      try {
        // 1. Try Dictionary API (Standard English words)
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord.toLowerCase()}`);
        
        // 2. Fetch Translation (Works better for phrases/compound words)
        // We use the original word for translation as it might be a compound like "prointerview-backend"
        const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|vi`);

        if (dictRes.ok) {
          const dictResult = await dictRes.json();
          setData(dictResult[0]);
        }

        if (transRes.ok) {
          const transResult = await transRes.json();
          const translatedText = transResult.responseData.translatedText;
          // Only set translation if it's actually different from the source (MyMemory returns source if not found)
          if (translatedText.toLowerCase() !== word.toLowerCase()) {
            setTranslation(translatedText);
          }
        }

        if (!dictRes.ok && !translation) {
          // If dictionary failed, try splitting if it's a compound word
          if (cleanWord.includes('-') || cleanWord.includes('_')) {
             setTranslation(`Cụm từ ghép: ${cleanWord.replace(/[-_]/g, ' ')}`);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [word]);

  if (!word) return null;

  return (
    <div className="dictionary-overlay" onClick={onClose}>
      <div className="dictionary-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>&times;</button>
        
        {loading && <div className="loader">Searching for "{word}"...</div>}
        
        {error && !translation && (
          <div className="error-state">
            <p>Could not find definition for <strong>{word}</strong></p>
          </div>
        )}

        {(data || translation) && (
          <div className="dict-content">
            <div className="dict-header">
              <div className="word-row">
                <h3>{word}</h3>
              </div>
              {translation && <div className="vi-translation-block">Nghĩa: {translation}</div>}
              {data && <span className="phonetic">{data.phonetic}</span>}
            </div>

            {data ? (
              <div className="meanings-list">
                {data.meanings.slice(0, 2).map((m, i) => (
                  <div key={i} className="meaning-item">
                    <span className="part-of-speech">{m.partOfSpeech}</span>
                    <p className="definition">{m.definitions[0].definition}</p>
                    {m.definitions[0].example && (
                      <p className="example">"{m.definitions[0].example}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-dict-found">
                <p className="hint-text">Từ này không có trong từ điển chuẩn, nhưng có thể hiểu là:</p>
                <div className="fallback-box">
                  {translation || word.replace(/[-_]/g, ' ')}
                </div>
              </div>
            )}
            
            <p className="dict-footer">Sources: Google Dict & MyMemory API</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPopup;
