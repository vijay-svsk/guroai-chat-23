
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";
import { getWelcomeMessage, getSpecialResponse } from "./chat-utils";
import { sendChatMessage } from "@/services/chat-service";

export const useChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Use the provided API key directly
  const apiKey = "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";

  useEffect(() => {
    // Add welcome message when chat is first opened
    if (isOpen && messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent body scrolling when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
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
      // Check for special message handling cases
      const specialResponse = await getSpecialResponse(userMessage.content);
      
      // If we have a special response, use it instead of calling the API
      if (specialResponse) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: specialResponse
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Use the extracted service function for API calls
        const answer = await sendChatMessage(userMessage.content, apiKey);
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: answer
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      // Improved error handling with more specific error messages
      let errorMessage = "Failed to get a response. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("connection")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. The server took too long to respond. Please try again.";
        } else if (error.message.includes("key") || error.message.includes("authenticate")) {
          errorMessage = "API authentication error. Please contact support.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return {
    isOpen,
    message,
    messages,
    isLoading,
    messagesEndRef,
    chatBoxRef,
    setMessage,
    handleToggleChat,
    handleSubmit,
    scrollToBottom
  };
};
