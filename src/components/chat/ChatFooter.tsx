
import { ChatInput } from "@/components/chat/ChatInput";

interface ChatFooterProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  userId: string | null;
  onFileUpload: (file: File) => void;
  onImageGenerate: () => void;
}

export const ChatFooter = ({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  userId,
  onFileUpload,
  onImageGenerate
}: ChatFooterProps) => {
  return (
    <div className="sticky bottom-0 bg-gradient-to-b from-transparent to-[#f8fafc]">
      <div className="max-w-5xl mx-auto w-full px-4">
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={onSubmit}
          isLoading={isLoading}
          disabled={!userId}
          onFileUpload={onFileUpload}
          onImageGenerate={onImageGenerate}
        />
        
        {/* Disclaimer Footer */}
        <div className="text-center text-xs text-gray-500 pb-2 pt-1">
          GuroAI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};
