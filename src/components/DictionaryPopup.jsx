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
      try {
        // 1. Fetch English Definition
        const dictPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        
        // 2. Fetch Vietnamese Translation
        const transPromise = fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|vi`);

        const [dictRes, transRes] = await Promise.all([dictPromise, transPromise]);

        if (dictRes.ok) {
          const dictResult = await dictRes.json();
          setData(dictResult[0]);
        }

        if (transRes.ok) {
          const transResult = await transRes.json();
          setTranslation(transResult.responseData.translatedText);
        }

        if (!dictRes.ok && !transRes.ok) {
          throw new Error('Word not found');
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
                {translation && <span className="vi-translation">({translation})</span>}
              </div>
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
            ) : translation ? (
              <div className="translation-only">
                <p>Nghĩa tiếng Việt: <strong>{translation}</strong></p>
                <p className="no-en-info">Không tìm thấy định nghĩa chi tiết bằng tiếng Anh.</p>
              </div>
            ) : null}
            
            <p className="dict-footer">Sources: Google Dict & MyMemory API</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPopup;
