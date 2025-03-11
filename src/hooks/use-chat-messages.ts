
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, ChatSession } from "@/types/chat";
import { 
  saveChatMessage, 
  sendChatRequest
} from "@/services/chat-service";

export const useChatMessages = (userId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processMessageSend = async (question: string, setQuestion: (q: string) => void) => {
    if (!question.trim()) return;
    
    const apiKey = localStorage.getItem("together_api_key") || "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066";

    const userMessage: ChatMessage = {
      role: 'user',
      content: question.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      if (userId) {
        await saveChatMessage(userMessage, userId);
      }
      
      const answer = await sendChatRequest(userMessage.content, apiKey);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answer
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (userId) {
        await saveChatMessage(assistantMessage, userId);
        return true;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    processMessageSend
  };
};
