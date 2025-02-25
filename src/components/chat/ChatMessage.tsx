
import { cn } from "@/lib/utils";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { FormulaRenderer } from "@/components/FormulaRenderer";
import { GuroAvatar } from "@/components/ui/guro-avatar";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
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
          <TypewriterEffect text={content} />
        ) : (
          <p className="text-[#023d54]/90 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </div>
  );
};
