
import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  text: string;
}

export const TypewriterEffect = ({ text }: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Check if the text contains image markdown
  const hasImageMarkdown = text.includes("![");

  useEffect(() => {
    // If text contains image markdown, display it immediately without typewriter effect
    if (hasImageMarkdown) {
      setDisplayText(text);
      setIsDone(true);
      return;
    }

    // Normal typewriter effect for text without images
    if (index < text.length && !isDone) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText + text[index]);
        setIndex(index + 1);
      }, 5);

      return () => clearTimeout(timeout);
    } else if (index >= text.length) {
      setIsDone(true);
    }
  }, [text, index, displayText, isDone, hasImageMarkdown]);

  // Function to process content for displaying
  const processContentForDisplay = (content: string) => {
    // Check if content contains an image markdown
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    
    if (imageRegex.test(content)) {
      // Replace image markdown with actual image elements
      return content.replace(imageRegex, (match, alt, url) => {
        return `<div class="my-4"><img src="${url}" alt="${alt}" class="max-w-full rounded-md shadow-md" style="max-height: 500px;" /></div>`;
      });
    }
    
    return content;
  };

  const processedContent = processContentForDisplay(displayText);
  const containsImage = processedContent !== displayText;

  return (
    <div className="prose max-w-none text-[#023d54]/90 whitespace-pre-wrap leading-relaxed">
      {containsImage ? (
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      ) : (
        displayText
      )}
    </div>
  );
};
