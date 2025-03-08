
import React from 'react';
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          onClick={onClick}
          className="h-16 w-16 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg animate-pulse-slow"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          1
        </span>
      </div>
      <div className="mt-2 px-3 py-1 bg-white shadow-md rounded-md text-guro-blue font-medium text-sm animate-fade-in-up">
        Ask GuroAI assistant
      </div>
    </div>
  );
};

export const MobileChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Button
          onClick={onClick}
          className="h-14 w-14 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg animate-pulse-slow"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          1
        </span>
      </div>
    </div>
  );
};
