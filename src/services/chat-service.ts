
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export const saveChatMessage = async (message: ChatMessage, userId: string) => {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      content: message.content,
      role: message.role,
      user_id: userId
    });
  
  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
  
  return true;
};

export const fetchChatSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by session (simplified approach using first message of conversations)
    const sessions = data.reduce((acc: any[], message: any, index: number) => {
      if (message.role === 'user' && (index === 0 || data[index-1].role === 'assistant')) {
        acc.push({
          id: message.id,
          message: message.content.substring(0, 40) + (message.content.length > 40 ? '...' : ''),
          date: new Date(message.created_at).toLocaleDateString()
        });
      }
      return acc;
    }, []);

    return sessions;
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    throw error;
  }
};

export const fetchUserChatHistory = async (userId: string) => {
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
    console.error('Error loading chat history:', error);
    throw error;
  }
};

export const fetchChatSession = async (sessionId: string, userId: string) => {
  try {
    // First find the timestamp of the selected message
    const { data: sessionMessage, error: sessionError } = await supabase
      .from('chat_messages')
      .select('created_at')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Find messages from this timestamp to the next user message
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', sessionMessage.created_at)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));
  } catch (error) {
    console.error('Error loading chat session:', error);
    throw error;
  }
};

export const sendChatRequest = async (question: string, apiKey?: string) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  // If API key is provided, add it to the headers
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const { data, error } = await supabase.functions.invoke('ask-guro', {
    body: { question, apiKey }
  });

  if (error) throw error;
  if (!data?.answer) throw new Error('No answer received');

  return data.answer;
};

export const processFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await supabase.functions.invoke('process-file', {
      body: formData,
    });

    if (error) throw error;
    return data.analysis;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
};
