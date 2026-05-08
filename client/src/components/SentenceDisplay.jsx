import React from 'react';

const SentenceDisplay = ({ sentence, userInput, onWordClick }) => {
  // Split sentence into words but keep track of absolute character indices
  const words = sentence.split(/(\s+)/); // Keep spaces as separate elements
  
  let globalCharIndex = 0;

  return (
    <div className="sentence-display">
      {words.map((word, wordIdx) => {
        const isSpace = /^\s+$/.test(word);
        
        if (isSpace) {
          const spaceChars = word.split('').map((char, i) => {
            const index = globalCharIndex++;
            let status = "";
            if (index < userInput.length) {
              status = userInput[index] === char ? "correct" : "incorrect";
            } else if (index === userInput.length) {
              status = "current";
            }
            return (
              <span key={`space-${index}`} className={`char ${status}`}>
                {"\u00A0"}
              </span>
            );
          });
          return spaceChars;
        }

        // It's a word
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        const wordChars = word.split('').map((char, i) => {
          const index = globalCharIndex++;
          let status = "";
          if (index < userInput.length) {
            status = userInput[index] === char ? "correct" : "incorrect";
          } else if (index === userInput.length) {
            status = "current";
          }
          return (
            <span key={`char-${index}`} className={`char ${status}`}>
              {char}
            </span>
          );
        });

        return (
          <span 
            key={`word-${wordIdx}`} 
            className="word-wrapper"
            onClick={() => onWordClick(cleanWord)}
            title="Click to see definition"
          >
            {wordChars}
          </span>
        );
      })}
    </div>
  );
};

export default SentenceDisplay;
