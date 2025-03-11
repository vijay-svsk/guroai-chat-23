
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, ChatSession } from "@/types/chat";
import { 
  fetchChatSessions, 
  fetchUserChatHistory, 
  fetchChatSession
} from "@/services/chat-service";

export const useChatHistory = (userId: string | null) => {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadChatSessions();
      setIsLoadingHistory(false);
    }
  }, [userId]);

  const loadChatSessions = async () => {
    if (!userId) return;

    try {
      const sessions = await fetchChatSessions(userId);
      setChatHistory(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadChatHistory = async () => {
    if (!userId) return;

    try {
      const messageHistory = await fetchUserChatHistory(userId);
      return messageHistory;
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadChatSession = async (sessionId: string) => {
    if (!userId) return [];

    try {
      const sessionMessages = await fetchChatSession(sessionId, userId);
      return sessionMessages;
    } catch (error) {
      console.error('Error loading chat session:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session.",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    chatHistory,
    isLoadingHistory,
    loadChatSessions,
    loadChatHistory,
    loadChatSession
  };
};
