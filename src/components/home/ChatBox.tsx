
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
  const [showPulse, setShowPulse] = useState(true);
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

  // Add effect to disable pulse after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

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
      {/* Chat icon button - Enhanced to be more noticeable */}
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-[#023d54] hover:bg-[#03506a] shadow-lg transition-transform duration-300 hover:scale-110"
          >
            <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-white">
              <GuroAvatar className="h-10 w-10" />
            </div>
          </Button>
          
          {/* Notification bubble */}
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-[#8cd09b] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
            1
          </div>
          
          {/* Pulse effect */}
          {showPulse && (
            <div className="absolute inset-0 rounded-full animate-ping bg-[#023d54] opacity-30"></div>
          )}
          
          {/* Chat indicator text */}
          <div className="absolute -top-10 right-0 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-medium text-[#023d54] whitespace-nowrap">
            Ask GuroAI assistant
            <div className="absolute bottom-0 right-5 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </div>
        </div>
      )}

      {/* Chat box */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl w-[350px] h-[450px] border border-gray-200 animate-fade-in-up">
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
