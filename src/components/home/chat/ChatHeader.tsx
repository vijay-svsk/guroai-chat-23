
import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuroAvatar } from "@/components/ui/guro-avatar";

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-[#023d54] text-white p-3 rounded-t-lg">
      <div className="flex items-center gap-2">
        <GuroAvatar className="h-6 w-6" />
        <span className="font-semibold">GuroAI Assistant</span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="h-8 w-8 text-white hover:bg-[#03506a]"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
