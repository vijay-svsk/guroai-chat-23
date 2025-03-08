
import React from 'react';
import { ChatMessage } from "@/types/chat";
import { ChatMessageItem, ChatLoadingIndicator } from "./ChatMessageItem";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, isLoading, messagesEndRef }: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {messages.map((msg, index) => (
        <ChatMessageItem key={index} message={msg} />
      ))}
      {isLoading && <ChatLoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};
