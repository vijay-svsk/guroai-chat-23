
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

// Extract the API call to a separate function
export const sendChatMessage = async (message: string, apiKey: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("chat", {
      body: { 
        message,
        apiKey
      },
    });

    if (error) {
      throw new Error(error.message || "Failed to get response");
    }
    
    if (!data?.answer) {
      throw new Error("No answer received from the assistant");
    }
    
    return data.answer;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

// Get full chat history for a user if needed
export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

// Save a chat message to the database
export const saveChatMessage = async (message: ChatMessage, userId?: string): Promise<boolean> => {
  // If no userId provided, just return true without saving
  if (!userId) return true;
  
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        content: message.content,
        role: message.role,
        user_id: userId
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving chat message:", error);
    return false;
  }
};
