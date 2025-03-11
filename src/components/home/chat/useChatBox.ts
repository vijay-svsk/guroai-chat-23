
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";
import { getWelcomeMessage } from "./chat-utils";
import { supabase } from "@/integrations/supabase/client";

// Simple client-side cache to improve responsiveness
const messageCache = new Map<string, string>();

export const useChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
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

    // Show optimistic user message immediately
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    // Check cache first for faster responses
    const cacheKey = userMessage.content.toLowerCase();
    if (messageCache.has(cacheKey)) {
      // Slight delay to make it feel more natural
      setTimeout(() => {
        const cachedResponse = messageCache.get(cacheKey) || "";
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cachedResponse
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        scrollToBottom();
      }, 300);
      return;
    }

    try {
      // Add a timeout to ensure the request doesn't hang indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
      // Get the API key from localStorage with the new default
      const apiKey = localStorage.getItem('togetherApiKey') || "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066";
      
      // Call the ask-guro function with apiKey parameter
      const { data, error } = await supabase.functions.invoke("ask-guro", {
        body: { 
          question: userMessage.content,
          togetherApiKey: apiKey
        }
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(error.message || "Failed to get response");
      }
      
      if (!data?.answer) {
        throw new Error("No answer received from the assistant");
      }
      
      // Store in cache for future use
      messageCache.set(cacheKey, data.answer);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Improved error handling with more specific error messages
      let errorMessage = "Failed to get a response. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("connection")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes("timeout") || error.message.includes("abort")) {
          errorMessage = "Request timed out. The server took too long to respond. Please try again.";
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
