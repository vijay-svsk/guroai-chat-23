
import React from 'react';
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="h-16 w-16 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
};

export const MobileChatToggleButton = ({ onClick }: ChatToggleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="h-14 w-14 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
