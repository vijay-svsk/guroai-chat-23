
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/subscription/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Plus, MessageSquare } from "lucide-react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
}

const AskGuro = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadSavedChats();
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

  const loadSavedChats = async () => {
    if (!userId) return;

    try {
      const { data: chats, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedChats = await Promise.all(chats.map(async (chat) => {
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', chat.id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        return {
          id: chat.id,
          title: chat.title || 'New Chat',
          messages: messages.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
          })),
          created_at: chat.created_at
        };
      }));

      setSavedChats(formattedChats);
      setIsLoadingHistory(false);
    } catch (error) {
      console.error('Error loading saved chats:', error);
      toast({
        title: "Error",
        description: "Failed to load saved chats.",
        variant: "destructive"
      });
      setIsLoadingHistory(false);
    }
  };

  const createNewChat = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title: 'New Chat'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentChatId(data.id);
      setMessages([]);
      await loadSavedChats();
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat.",
        variant: "destructive"
      });
    }
  };

  const loadChatSession = async (chatId: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
      setCurrentChatId(chatId);
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
    if (!userId || !currentChatId) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        content: message.content,
        role: message.role,
        user_id: userId,
        session_id: currentChatId
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

    if (!currentChatId) {
      await createNewChat();
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
      await loadSavedChats(); // Refresh the saved chats list
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
    <div className="flex min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
          <div className="pt-4">
            <Button
              onClick={createNewChat}
              className="w-full flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>

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

      {/* Saved Chats Sidebar */}
      <div className="w-80 border-l bg-gray-50">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#023d54] mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Saved Chats
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              {savedChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChatSession(chat.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    currentChatId === chat.id
                      ? "bg-[#023d54] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <p className="truncate text-sm">{chat.title}</p>
                  <p className="text-xs opacity-70">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AskGuro;
