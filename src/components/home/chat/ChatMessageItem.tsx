
import React from 'react';
import { cn } from "@/lib/utils";
import { GuroAvatar } from "@/components/ui/guro-avatar";
import { ChatMessage } from "@/types/chat";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const { role, content } = message;
  
  return (
    <div
      className={cn(
        "flex items-start gap-2",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "assistant" && (
        <div className="flex-shrink-0 w-8 h-8">
          <GuroAvatar />
        </div>
      )}
      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%] text-left",
          role === "user"
            ? "bg-[#023d54] text-white"
            : "bg-gray-100 text-gray-800"
        )}
      >
        <p className="text-sm whitespace-pre-wrap text-left">{content}</p>
      </div>
      {role === "user" && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
      )}
    </div>
  );
};

export const ChatLoadingIndicator = () => {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-8 h-8">
        <GuroAvatar />
      </div>
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};
