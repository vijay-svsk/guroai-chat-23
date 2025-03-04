
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";
import { GuroAvatar } from "@/components/ui/guro-avatar";
import { supabase } from "@/integrations/supabase/client";

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Use the provided API key directly
  const apiKey = "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";
  
  useEffect(() => {
    // Add welcome message when chat is first opened
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m GuroAI\'s assistant. How can I help you today?'
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Use Supabase Edge Function instead of direct API call
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { 
          message: userMessage.content,
          apiKey
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to get response");
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat icon button */}
      {!isOpen && (
        <div className="flex flex-col items-center">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <div className="mt-2 px-3 py-1 bg-white shadow-md rounded-md text-guro-blue font-medium text-sm">
            Ask GuroAI assistant
          </div>
        </div>
      )}

      {/* Chat box */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl w-[350px] h-[450px] border border-gray-200">
          {/* Chat header */}
          <div className="flex items-center justify-between bg-[#023d54] text-white p-3 rounded-t-lg">
            <div className="flex items-center gap-2">
              <GuroAvatar className="h-6 w-6" />
              <span className="font-semibold">GuroAI Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-[#03506a]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8">
                    <GuroAvatar />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    msg.role === "user"
                      ? "bg-[#023d54] text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
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
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="resize-none min-h-[40px] max-h-[100px] text-sm p-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
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
        </div>
      )}
    </div>
  );
};
