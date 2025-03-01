
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  message: string;
  date: string;
}

export const useChat = (userId: string | null) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset messages when the component is mounted
    setMessages([]);
  }, []);

  useEffect(() => {
    if (userId) {
      loadChatSessions();
      setIsLoadingHistory(false);
    }
  }, [userId]);

  const loadChatSessions = async () => {
    if (!userId) return;

    try {
      // Group chat messages by timestamps to get distinct chat sessions
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

      setChatHistory(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadChatHistory = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })));
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

    // Find the session message and load all related messages
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

      setMessages(data.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    } catch (error) {
      console.error('Error loading chat session:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session.",
        variant: "destructive"
      });
    }
  };

  const saveMessage = async (message: ChatMessage) => {
    if (!userId) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        content: message.content,
        role: message.role,
        user_id: userId
      });

    if (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message.",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !userId) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: question.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);
    scrollToBottom();

    try {
      await saveMessage(userMessage);

      const { data, error } = await supabase.functions.invoke('ask-guro', {
        body: { question: userMessage.content }
      });

      if (error) throw error;
      if (!data?.answer) throw new Error('No answer received');

      // The response should already be cleaned by the edge function
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      await loadChatSessions();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
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
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('process-file', {
        body: formData,
      });

      if (error) throw error;

      const userMessage: ChatMessage = {
        role: 'user',
        content: `I've uploaded a file named "${file.name}". Please analyze it.`
      };

      setMessages(prev => [...prev, userMessage]);
      setQuestion("");
      setIsLoading(true);
      scrollToBottom();

      await saveMessage(userMessage);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.analysis
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
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
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      // Place cursor at the end
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  };

  return {
    question,
    setQuestion,
    messages,
    isLoading,
    isLoadingHistory,
    chatHistory,
    chatEndRef,
    startNewChat,
    loadChatSession,
    handleSubmit,
    handleFileUpload,
    handleImageGeneration,
  };
};
