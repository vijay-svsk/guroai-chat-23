
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatSession } from "@/types/chat";

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

// Alias for sendChatMessage to match function name in use-chat.ts
export const sendChatRequest = async (message: string): Promise<string> => {
  // Use the provided API key directly - hardcoded the same way as in useChatBox
  const apiKey = "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";
  return sendChatMessage(message, apiKey);
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

// Alias for getChatHistory to match function name in use-chat.ts
export const fetchUserChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  return getChatHistory(userId);
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

// Get chat sessions for a user - Since there's no chat_sessions table,
// we'll fetch the most recent chat messages and format them as chat sessions
export const fetchChatSessions = async (userId: string): Promise<ChatSession[]> => {
  try {
    // Get the most recent messages from chat_messages table
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    
    // Process data to create chat sessions
    // Group messages or just use individual messages as session previews
    const sessions: ChatSession[] = data.map((message: any) => ({
      id: message.id,
      message: message.content.substring(0, 30) + (message.content.length > 30 ? '...' : ''),
      date: new Date(message.created_at).toLocaleDateString()
    }));
    
    return sessions;
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    // Return empty array instead of throwing to handle more gracefully
    return [];
  }
};

// Get messages for a specific chat session
// Since we don't have a dedicated chat_sessions table, 
// we'll use the message ID as session ID and return related messages
export const fetchChatSession = async (sessionId: string, userId: string): Promise<ChatMessage[]> => {
  try {
    // Get the specific message
    const { data: messageData, error: messageError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();
      
    if (messageError) throw messageError;
    
    // Get messages from the same approximate time (within 1 hour)
    // This is a simple way to group related messages without a session table
    const messageTime = new Date(messageData.created_at);
    const oneHourLater = new Date(messageTime.getTime() + 60 * 60 * 1000);
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', messageTime.toISOString())
      .lte('created_at', oneHourLater.toISOString())
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
  } catch (error) {
    console.error("Error fetching chat session:", error);
    // If we can't get the session, just return the single message
    return [{ 
      role: 'assistant', 
      content: 'Unable to retrieve the complete conversation.' 
    }];
  }
};

// Process an uploaded file
export const processFile = async (file: File): Promise<string> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Using hardcoded API key as in useChatBox
    const apiKey = "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";
    
    // Call a file processing endpoint - assuming we use the supabase functions
    const { data, error } = await supabase.functions.invoke("process-file", {
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (error) throw error;
    
    return data.analysis || 'File processed successfully.';
  } catch (error) {
    console.error("Error processing file:", error);
    throw new Error("Failed to process the file. Please try again.");
  }
};
