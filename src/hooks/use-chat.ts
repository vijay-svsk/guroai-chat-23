
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChatUI } from "@/hooks/use-chat-ui";
import { ChatMessage, ChatSession } from "@/types/chat";
import { 
  saveChatMessage, 
  fetchChatSessions, 
  fetchUserChatHistory, 
  fetchChatSession,
  sendChatRequest,
  processFile
} from "@/services/chat-service";

export type { ChatMessage, ChatSession };

export const useChat = (userId: string | null) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();
  const { chatEndRef, scrollToBottom, focusTextarea } = useChatUI();

  useEffect(() => {
    // Reset messages when the component is mounted
    setMessages([]);
    
    // Check if API key exists in localStorage
    const apiKey = localStorage.getItem("openai_api_key");
    setHasApiKey(!!apiKey);
  }, []);

  useEffect(() => {
    if (userId) {
      loadChatSessions();
      setIsLoadingHistory(false);
    }
  }, [userId]);

  const saveApiKey = (apiKey: string) => {
    localStorage.setItem("openai_api_key", apiKey);
    setHasApiKey(true);
  };

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
      setMessages(messageHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadChatSession = async (sessionId: string) => {
    if (!userId) return;

    try {
      const sessionMessages = await fetchChatSession(sessionId, userId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Error loading chat session:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session.",
        variant: "destructive"
      });
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !userId) return;
    
    // Check if user has provided an API key
    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide your OpenAI API key to use GuroAI Chat",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: question.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);
    scrollToBottom();

    try {
      await saveChatMessage(userMessage, userId);
      
      // Pass the API key to the sendChatRequest function
      const answer = await sendChatRequest(userMessage.content, apiKey);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveChatMessage(assistantMessage, userId);
      await loadChatSessions();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again or check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!userId) return;

    try {
      const userMessage: ChatMessage = {
        role: 'user',
        content: `I've uploaded a file named "${file.name}". Please analyze it.`
      };

      setMessages(prev => [...prev, userMessage]);
      setQuestion("");
      setIsLoading(true);
      scrollToBottom();

      await saveChatMessage(userMessage, userId);
      
      const analysis = await processFile(file);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: analysis
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveChatMessage(assistantMessage, userId);
      await loadChatSessions();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleImageGeneration = () => {
    if (!userId) return;
    
    // Set a prompt for OpenAI DALL-E image generation
    setQuestion("generate an image about ");
    
    // Focus on the textarea
    focusTextarea();
  };

  return {
    question,
    setQuestion,
    messages,
    isLoading,
    isLoadingHistory,
    chatHistory,
    chatEndRef,
    hasApiKey,
    saveApiKey,
    startNewChat,
    loadChatSession,
    handleSubmit,
    handleFileUpload,
    handleImageGeneration,
  };
};
