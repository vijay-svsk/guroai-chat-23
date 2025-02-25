
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, History } from "lucide-react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
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
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [chatHistory, setChatHistory] = useState<{id: string, message: string, date: string}[]>([]);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Reset messages when the component is mounted
    setMessages([]);
    checkUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadChatSessions();
      setIsLoadingHistory(false);
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

  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
    setShowPreviousChats(false);
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
      
      setShowPreviousChats(false);
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
    
    // Set a prompt for DALL-E image generation
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
      await loadChatSessions(); // Refresh chat history
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
        <div className="flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
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
      {/* Top bar with New Chat button */}
      <div className="sticky top-0 z-10 bg-white bg-opacity-95 shadow-sm border-b border-gray-200 py-2">
        <div className="max-w-5xl mx-auto w-full px-4 flex justify-center">
          <Button
            onClick={startNewChat}
            className="bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#023d54] flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
      </div>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-4 relative">
        {/* Previous Responses Sidebar */}
        <div className="relative">
          <Button
            onClick={() => setShowPreviousChats(!showPreviousChats)}
            className="fixed left-4 top-16 lg:left-8 bg-[#023d54] hover:bg-[#023d54]/90 text-white"
            variant="default"
          >
            <History className="w-4 h-4 mr-2" />
            Previous Responses
          </Button>

          <div 
            className={cn(
              "fixed left-0 top-0 h-full w-64 bg-white shadow-lg transition-all duration-300 transform z-20 border-r border-gray-200 pt-16",
              showPreviousChats ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="p-4 overflow-y-auto h-full">
              <h3 className="font-medium text-lg mb-4 text-[#023d54]">Chat History</h3>
              {chatHistory.length === 0 ? (
                <p className="text-gray-500">No previous chats found</p>
              ) : (
                <div className="space-y-2">
                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id} 
                      className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => loadChatSession(chat.id)}
                    >
                      <p className="font-medium text-sm text-[#023d54]">{chat.message}</p>
                      <p className="text-xs text-gray-500">{chat.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Overlay to close sidebar when clicked outside */}
          {showPreviousChats && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setShowPreviousChats(false)}
            />
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              chatEndRef={chatEndRef}
            />
          )}
        </div>
      </div>

      {/* Chat Input and Footer */}
      <div className="sticky bottom-0 bg-gradient-to-b from-transparent to-[#f8fafc]">
        <div className="max-w-5xl mx-auto w-full px-4">
          <ChatInput
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={!userId}
            onFileUpload={handleFileUpload}
            onImageGenerate={handleImageGeneration}
          />
          
          {/* Disclaimer Footer */}
          <div className="text-center text-xs text-gray-500 pb-2 pt-1">
            GuroAI can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskGuro;
