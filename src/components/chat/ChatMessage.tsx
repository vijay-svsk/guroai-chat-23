
import { cn } from "@/lib/utils";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { FormulaRenderer } from "@/components/FormulaRenderer";
import { GuroAvatar } from "@/components/ui/guro-avatar";
import { useEffect, useState } from "react";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  // Process content to render images properly and handle 2-column format
  const processContent = (text: string) => {
    // Check if content contains an image markdown
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const hasImage = imageRegex.test(text);
    
    // Check if content appears to be a lesson plan in 2-column format
    const isLessonPlan = text.includes("Column 1") && text.includes("Column 2");
    
    if (isLessonPlan) {
      // Process lesson plan with 2-column layout
      return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        ${text.replace(/IMAGE PROMPT: (.*?)$/gm, '<div class="col-span-2 my-4 p-3 bg-blue-50 rounded-md text-blue-700"><strong>Image Prompt:</strong> $1</div>')}
      </div>`;
    } else if (hasImage) {
      // Replace image markdown with actual image elements
      return text.replace(imageRegex, (match, alt, url) => {
        return `<div class="my-4"><img src="${url}" alt="${alt}" class="max-w-full rounded-md shadow-md" style="max-height: 500px;" /></div>`;
      });
    }
    
    return text;
  };

  const processedContent = processContent(content);
  const containsImage = processedContent !== content;
  const isLessonPlan = processedContent.includes('grid-cols-2');

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-6",
        role === 'assistant' ? "bg-gray-50" : "bg-white"
      )}
    >
      <div className="flex-shrink-0 w-8 h-8">
        {role === 'assistant' ? (
          <GuroAvatar />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        {role === 'assistant' ? (
          isLessonPlan || containsImage ? (
            <div 
              className="text-[#023d54]/90 whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          ) : (
            <TypewriterEffect text={content} />
          )
        ) : (
          <p className="text-[#023d54]/90 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};
