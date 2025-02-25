import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/subscription/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { Bot } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const AskGuro = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadChatHistory();
    }
  }, [userId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    } else {
      setIsLoadingHistory(false);
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat feature.",
        variant: "destructive"
      });
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

      setMessages(data.map(msg => ({
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

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
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
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
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

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#023d54] tracking-tight mb-2">
              Please Sign In
            </h1>
            <p className="text-2xl text-[#023d54]/80 tracking-tight">
              Sign in to start chatting with GuroAI
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      <Header />
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4">
        <div className="mb-4">
          <Button
            onClick={startNewChat}
            className="bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#023d54] flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            chatEndRef={chatEndRef}
          />
        )}

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={!userId}
        />
      </div>
    </div>
  );
};

export default AskGuro;
