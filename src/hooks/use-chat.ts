
import { useState, useEffect } from "react";
import { useChatUI } from "@/hooks/use-chat-ui";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useFileProcessing } from "@/hooks/use-file-processing";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { ChatMessage, ChatSession } from "@/types/chat";

export type { ChatMessage, ChatSession };

export const useChat = (userId: string | null) => {
  const [question, setQuestion] = useState("");
  const [hasApiKey, setHasApiKey] = useState(true);
  const { chatEndRef, scrollToBottom, focusTextarea } = useChatUI();
  
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    processMessageSend
  } = useChatMessages(userId);
  
  const {
    chatHistory,
    isLoadingHistory,
    loadChatSessions,
    loadChatHistory,
    loadChatSession: fetchSession
  } = useChatHistory(userId);
  
  const { handleFileUpload } = useFileProcessing(userId, setMessages, setIsLoading, loadChatSessions);
  const { handleImageGeneration } = useImageGeneration(userId);

  useEffect(() => {
    setMessages([]);
    localStorage.setItem("together_api_key", "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066");
    setHasApiKey(true);
  }, []);

  const saveApiKey = (apiKey: string) => {
    localStorage.setItem("together_api_key", apiKey);
    setHasApiKey(true);
  };

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  const loadChatSession = async (sessionId: string) => {
    const sessionMessages = await fetchSession(sessionId);
    if (sessionMessages.length > 0) {
      setMessages(sessionMessages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processMessageSend(question, setQuestion);
    scrollToBottom();
    await loadChatSessions();
    scrollToBottom();
  };

  return {
    question,
    setQuestion,
    messages,
    isLoading,
    isLoadingHistory,
    chatHistory,
    chatEndRef,
    hasApiKey: true,
    saveApiKey,
    startNewChat,
    loadChatSession,
    handleSubmit,
    handleFileUpload,
    handleImageGeneration,
  };
};
