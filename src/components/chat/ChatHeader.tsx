
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatHeaderProps {
  startNewChat: () => void;
  isLoading: boolean;
}

export const ChatHeader = ({ startNewChat, isLoading }: ChatHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white bg-opacity-95 shadow-sm border-b border-gray-200 py-2">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-center">
        <Button
          onClick={startNewChat}
          className="bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#023d54] flex items-center gap-2"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
    </div>
  );
};
