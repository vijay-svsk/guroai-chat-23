
import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number;
}

export const TypewriterEffect = ({ text, speed = 5 }: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const cleanText = text.replace(/[#*]/g, '');

  useEffect(() => {
    if (currentIndex < cleanText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + cleanText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, cleanText, speed]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};
