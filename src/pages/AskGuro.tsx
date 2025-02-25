
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/subscription/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send } from "lucide-react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      <Header />
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4">
        {isLoadingHistory ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingState />
          </div>
        ) : !userId ? (
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
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#023d54] tracking-tight mb-2">
                Hi, I'm GuroAI.
              </h1>
              <p className="text-2xl text-[#023d54]/80 tracking-tight">
                How can I help you today?
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 py-8 space-y-6 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full items-start gap-4 p-6",
                  message.role === 'assistant' ? "bg-gray-50" : "bg-white"
                )}
              >
                <div className="flex-shrink-0 w-8 h-8">
                  {message.role === 'assistant' ? (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#023d54]">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
                      <div className="w-4 h-4 rounded-full bg-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[#023d54]/90 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex w-full items-start gap-4 p-6 bg-gray-50">
                <div className="flex-shrink-0 w-8 h-8">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#023d54]">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <LoadingState />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        <div className="sticky bottom-0 py-4 bg-gradient-to-b from-transparent to-[#f8fafc]">
          <div className="relative max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything"
                disabled={isLoading || !userId}
                className="w-full pl-4 pr-14 py-6 text-lg rounded-full border-2 border-[#023d54]/10 focus-visible:ring-[#023d54] text-[#023d54] shadow-lg transition-shadow duration-200 hover:shadow-xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !question.trim() || !userId}
                  className={cn(
                    "h-10 w-10 rounded-full bg-[#023d54] hover:bg-[#023d54]/90 transition-all duration-200",
                    question.trim() ? "opacity-100 scale-100" : "opacity-70 scale-95"
                  )}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskGuro;
