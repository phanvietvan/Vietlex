import React, { useState, useEffect } from 'react';

const DictionaryPopup = ({ word, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!word) return;

    const fetchDefinition = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        if (!response.ok) throw new Error('Word not found');
        const result = await response.json();
        setData(result[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  if (!word) return null;

  return (
    <div className="dictionary-overlay" onClick={onClose}>
      <div className="dictionary-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>&times;</button>
        
        {loading && <div className="loader">Searching for "{word}"...</div>}
        
        {error && (
          <div className="error-state">
            <p>Could not find definition for <strong>{word}</strong></p>
          </div>
        )}

        {data && (
          <div className="dict-content">
            <div className="dict-header">
              <h3>{data.word}</h3>
              <span className="phonetic">{data.phonetic}</span>
            </div>

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
            
            <p className="dict-footer">Source: Google Dictionary API</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryPopup;
