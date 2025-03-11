
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";
import { processFile } from "@/services/chat-service";
import { saveChatMessage } from "@/services/chat-service";

export const useFileProcessing = (
  userId: string | null,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loadChatSessions: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!userId) return;

    try {
      const userMessage: ChatMessage = {
        role: 'user',
        content: `I've uploaded a file named "${file.name}". Please analyze it.`
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

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
    }
  };

  return { handleFileUpload };
};
