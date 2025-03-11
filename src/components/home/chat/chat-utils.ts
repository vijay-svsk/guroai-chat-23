
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

// Get special responses based on user message content - only for the homepage chat assistant
export const getSpecialResponse = async (userMessage: string): Promise<string | null> => {
  // No more special responses - let the AI handle everything
  return null;
};

// Initial welcome message
export const getWelcomeMessage = (): ChatMessage => {
  return {
    role: 'assistant',
    content: `Hello! I'm GuroAI, your AI assistant. I can help you with any questions or tasks. What would you like to know today?`
  };
};
