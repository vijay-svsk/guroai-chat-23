
import { Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface ChatInputProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled: boolean;
  onFileUpload?: (file: File) => void;
}

export const ChatInput = ({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  disabled,
  onFileUpload
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="sticky bottom-0 py-4 bg-gradient-to-b from-transparent to-[#f8fafc]">
      <div className="relative max-w-3xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <div className="flex items-end gap-2">
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx"
                disabled={isLoading || disabled}
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-colors",
                  "border-2 border-[#023d54]/10 hover:bg-gray-100",
                  (isLoading || disabled) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Upload className="w-5 h-5 text-[#023d54]" />
              </label>
            </div>
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything"
                disabled={isLoading || disabled}
                className="w-full pl-4 pr-14 py-3 text-lg rounded-full border-2 border-[#023d54]/10 focus-visible:ring-[#023d54] text-[#023d54] shadow-lg transition-shadow duration-200 hover:shadow-xl resize-none overflow-hidden min-h-[48px] max-h-[200px]"
                style={{ lineHeight: '1.5' }}
              />
              <div className="absolute right-3 bottom-1.5">
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
