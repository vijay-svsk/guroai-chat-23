
import React from 'react';
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = ({ message, setMessage, onSubmit, isLoading }: ChatInputProps) => {
  return (
    <div className="p-3 border-t">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="resize-none min-h-[40px] max-h-[100px] text-sm p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 bg-[#023d54] hover:bg-[#03506a]"
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
