
import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface FormulaRendererProps {
  text: string;
}

export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ text }) => {
  const parts = text.split(/(\\$\\$.*?\\$\\$|\$.*?\$)/gs);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Display mode formula
          const formula = part.slice(2, -2);
          return <BlockMath key={index}>{formula}</BlockMath>;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          // Inline formula
          const formula = part.slice(1, -1);
          return <InlineMath key={index}>{formula}</InlineMath>;
        } else {
          // Regular text
          return <span key={index}>{part}</span>;
        }
      })}
    </>
  );
};
