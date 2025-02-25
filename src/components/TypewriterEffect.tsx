
import React, { useState, useEffect } from 'react';
import { FormulaRenderer } from './FormulaRenderer';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
}

export const TypewriterEffect = ({ text, speed = 5 }: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const cleanText = text.replace(/[#*]/g, '');

  useEffect(() => {
    if (currentIndex < cleanText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + cleanText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, cleanText, speed]);

  return (
    <span className="whitespace-pre-wrap">
      {isComplete ? (
        <FormulaRenderer text={displayedText} />
      ) : (
        displayedText
      )}
    </span>
  );
};
