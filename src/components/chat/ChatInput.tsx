
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ChatInput = ({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  disabled
}: ChatInputProps) => {
  return (
    <div className="sticky bottom-0 py-4 bg-gradient-to-b from-transparent to-[#f8fafc]">
      <div className="relative max-w-3xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything"
            disabled={isLoading || disabled}
            className="w-full pl-4 pr-14 py-6 text-lg rounded-full border-2 border-[#023d54]/10 focus-visible:ring-[#023d54] text-[#023d54] shadow-lg transition-shadow duration-200 hover:shadow-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !question.trim() || disabled}
              className={cn(
                "h-10 w-10 rounded-full bg-[#023d54] hover:bg-[#023d54]/90 transition-all duration-200",
                question.trim() ? "opacity-100 scale-100" : "opacity-70 scale-95"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
